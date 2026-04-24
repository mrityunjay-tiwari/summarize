import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, embed, convertToCoreMessages, convertToModelMessages } from "ai";
import { z } from "zod";
import { prisma } from "@/prisma/src/index";
import { chunkSchema } from "@/types/chunk-schema";

const ChatRequestSchema = z.object({
    messages: z.array(z.any()),
    document_id: z.string().min(1, "document_id is required"),
    file_url: z.string().optional(),
}).loose();

type TChatRequestSchema = z.infer<typeof ChatRequestSchema>;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[RAG] Incoming chat body:", JSON.stringify(body, null, 2));
        
        let parsedData;
        try {
            parsedData = ChatRequestSchema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("[RAG]Validation failed:", error.message);
                return Response.json({ error: "Validation error", details: error.message });
            }
            throw error;
        }

        const { messages, document_id, file_url } = parsedData;

        const lastMsg = messages[messages.length - 1];
        let latestMessageText = lastMsg?.content;
        
        if (!latestMessageText && lastMsg?.parts) {
            const textParts = lastMsg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text);
            latestMessageText = textParts.join(" ");
        }

        if (!latestMessageText) {
            console.error("[RAG] No query message found in array:", messages);
            return Response.json({ error: "No query message found" }, { status: 400 });
        }

        console.log(`[RAG] Generating query embedding for Document: ${document_id}`);

        const { embedding: queryEmbedding } = await embed({
            model: openrouter.textEmbeddingModel("nvidia/llama-nemotron-embed-vl-1b-v2:free"),
            value: latestMessageText,
        });
        const stringifiedVector = JSON.stringify(queryEmbedding);

        const relevantChunks: Array<{
             id: string;
             text: string;
             metadata: {
                types: Array<string>,
                filename: string,
                headings: Array<string>,
                page_numbers: Array<number>,
             };
             similarity: number;
        }> = await prisma.$queryRaw`
            SELECT 
                id, 
                text, 
                metadata, 
                1 - (embedding <=> ${stringifiedVector}::vector) as similarity
            FROM "DocumentChunk"
            WHERE document_id = ${document_id}
            ORDER BY embedding <=> ${stringifiedVector}::vector
            LIMIT 15;
        `;

        const MINIMUM_SIMILARITY = 0.05;
        const topResults = relevantChunks.filter((chunk) => chunk.similarity > MINIMUM_SIMILARITY);
        console.log("Top results:", JSON.stringify(topResults, null, 2));

        const formattedContexts = topResults.map((chunk, index) => {
            const meta = typeof chunk.metadata === 'string' ? JSON.parse(chunk.metadata) : chunk.metadata;
            
            let pageNumStr = "";
            if (meta?.page_numbers && Array.isArray(meta.page_numbers) && meta.page_numbers.length > 0) {
                pageNumStr = meta.page_numbers.join(", ");
            } else if (meta?.loc?.pageNumber) {
                pageNumStr = meta.loc.pageNumber;
            } else if (meta?.page) {
                pageNumStr = meta.page;
            }

            const page = pageNumStr ? `Page ${pageNumStr}` : `Document`;
            
            let headingStr = "";
            if (meta?.headings && Array.isArray(meta.headings) && meta.headings.length > 0) {
                headingStr = ` (Headings: ${meta.headings.join(" > ")})`;
            }
            
            return `[Citation ${index + 1}] (Source: ${page})${headingStr}\n${chunk.text}`;
        });

        const systemMessage = `You are a helpful and intelligent AI assistant answering questions regarding a specific PDF document.
        Use the following extracted context from the document to answer the user's question accurately. 
        
        Guidelines:
        1. Synthesize your final answer using ONLY the provided sources. Do not hallucinate or use outside knowledge.
        2. If the context does not contain the answer, politely state that you cannot find the answer in the provided document.
        3. At the very end of your response, ALWAYS include a nicely formatted "## Sources" section tracing back your sources to their exact Source Pages, how to do it - you are getting the chunks (which has schema as ${chunkSchema}) which has text and also had metadata, the
            metadata literally has array of page numbers, whatever chunks you ar using to give answer you just need to see this page no. from their meta and then at last in the source section you just need to  pass sources like [Page 1](#page=1), [Page 2](#page=2), [Page 3](#page=3) in sorted manner.
        4. Not always give answers in bullet points, give answers in tables also if needed, it definitely not means that never answer in bullet points, answer in both the formats as required and best suited for the answer, just prefer table if you can for some cases.
        5. ALWAYS USE SEARCH and send sources.

        --- CONTEXT PIPELINE ---
        ${formattedContexts.length > 0 ? formattedContexts.join("\n\n") : "No relevant context found in document."}
        --- END CONTEXT PIPELINE ---`;

        console.log(`[RAG] Streaming ${topResults.length} chunks to LLM for Document: ${document_id}`);

        const result = await streamText({
            // model: openrouter("openai/gpt-4o-mini"),
            model: openrouter("openai/gpt-oss-20b:free"),
            system: systemMessage,

            messages: convertToModelMessages(messages),
        });

        console.log("Result content:", await (result.content))
        return result.toUIMessageStreamResponse({
            sendReasoning: true,
            sendSources: true,
        });
    } catch (error) {
        console.error("Error in RAG chat route:", error);
        return Response.json({
            error: "An error occurred during chat processing"
        }, { status: 500 });
    }
}
