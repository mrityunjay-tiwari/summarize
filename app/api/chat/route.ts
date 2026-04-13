import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, embed, cosineSimilarity } from "ai";

export async function POST(req: Request) {
    try {
        const { messages, documentChunks, documentEmbeddings } = await req.json();

        const latestMessage = messages[messages.length - 1].content;

        const { embedding: queryEmbedding } = await embed({
            model: openrouter.textEmbeddingModel("nvidia/llama-nemotron-embed-vl-1b-v2:free"),
            value: latestMessage,
        });

        const chunksWithScores = documentChunks.map((chunk: string, index: number) => {
            const score = cosineSimilarity(queryEmbedding, documentEmbeddings[index]);
            return { chunk, score };
        });

        chunksWithScores.sort((a: any, b: any) => b.score - a.score);

        const topChunks = chunksWithScores.slice(0, 3).map((item: any) => item.chunk);

        const systemMessage = `You are a helpful AI assistant answering questions about a PDF document.
        Use the following extracted context from the document to answer the user's question. 
        If you don't know the answer based on the context, politely state that you cannot find the answer in the provided document.

        --- CONTEXT ---
        ${topChunks.join("\n\n")}
        --- END CONTEXT ---`;

        const result = await streamText({
            model: openrouter("arcee-ai/trinity-large-preview:free"),
            system: systemMessage,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("error in chat route:", error);
        return Response.json({
            error: "error during chat processing"
        }, { status: 500 });
    }
}
