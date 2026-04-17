import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, embed, convertToCoreMessages, convertToModelMessages } from "ai";
import { z } from "zod";
import { prisma } from "@/prisma/src/index";

const ChatRequestSchema = z.object({
    messages: z.array(z.any()),
    document_id: z.string().min(1, "document_id is required"),
}).loose();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[RAG] Incoming chat body:", JSON.stringify(body, null, 2));
        
        let parsedData;
        try {
            parsedData = ChatRequestSchema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("[RAG] Validation failed:", error.message);
                return Response.json({ error: "Validation payload missing or incorrect", details: error.message }, { status: 400 });
            }
            throw error;
        }

        const { messages, document_id } = parsedData;

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
             metadata: any;
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

        const formattedContexts = topResults.map((chunk, index) => {
            const meta = typeof chunk.metadata === 'string' ? JSON.parse(chunk.metadata) : chunk.metadata;
            const page = meta?.loc?.pageNumber ? `Page ${meta.loc.pageNumber}` : meta?.page ? `Page ${meta.page}` : `Document`;
            
            return `[Citation ${index + 1}] (Source: ${page})\n${chunk.text}`;
        });

        const systemMessage = `You are a helpful and intelligent AI assistant answering questions regarding a specific PDF document.
        Use the following extracted context from the document to answer the user's question accurately. 

        Guidelines:
        1. Synthesize your final answer using ONLY the provided sources. Do not hallucinate or use outside knowledge.
        2. If the context does not contain the answer, politely state that you cannot find the answer in the provided document.
        3. IMPORTANT: When providing your answer, you MUST cite your sources using the [Citation X] format. You can do this inline like this: "According to the document [Citation 1], the revenue increased."
        4. At the very end of your response, ALWAYS include a nicely formatted "## Sources" section tracing back your [Citation X]'s to their exact Source Pages.

        --- CONTEXT PIPELINE ---
        ${formattedContexts.length > 0 ? formattedContexts.join("\n\n") : "No relevant context found in document."}
        --- END CONTEXT PIPELINE ---`;

        console.log(`[RAG] Streaming ${topResults.length} chunks to LLM for Document: ${document_id}`);

        const result = await streamText({
            model: openrouter("openai/gpt-4o-mini"),
            system: systemMessage,
            messages: convertToModelMessages(messages),
        });

        // console.log("Result content:", await (result.content))
        return result.toUIMessageStreamResponse({
            sendReasoning: true
        });
    } catch (error) {
        console.error("Error in RAG chat route:", error);
        return Response.json({
            error: "An error occurred during chat processing"
        }, { status: 500 });
    }
}
