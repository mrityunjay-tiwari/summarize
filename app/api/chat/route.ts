import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, embed, cosineSimilarity } from "ai";

export async function POST(req: Request) {
    try {
        // We expect the chat messages, and the previously generated chunks + embeddings
        const { messages, documentChunks, documentEmbeddings } = await req.json();

        // Get the last user message to use as the query
        const latestMessage = messages[messages.length - 1].content;

        // 1. Embed the user's query
        const { embedding: queryEmbedding } = await embed({
            model: openrouter.textEmbeddingModel("nvidia/llama-nemotron-embed-vl-1b-v2:free"),
            value: latestMessage,
        });

        // 2. Perform Semantic Search to find relevant chunks
        const chunksWithScores = documentChunks.map((chunk: string, index: number) => {
            const score = cosineSimilarity(queryEmbedding, documentEmbeddings[index]);
            return { chunk, score };
        });

        // Sort descending by score to get the most relevant chunks at the top
        chunksWithScores.sort((a: any, b: any) => b.score - a.score);

        // Take top 3 or 4 relevant chunks
        const topChunks = chunksWithScores.slice(0, 3).map((item: any) => item.chunk);

        // 3. Build context for the LLM using the top chunks
        const systemMessage = `You are a helpful AI assistant answering questions about a PDF document.
        Use the following extracted context from the document to answer the user's question. 
        If you don't know the answer based on the context, politely state that you cannot find the answer in the provided document.

        --- CONTEXT ---
        ${topChunks.join("\n\n")}
        --- END CONTEXT ---`;

        // 4. Stream the response back to the client
        const result = await streamText({
            // You can use any chat model you prefer here
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
