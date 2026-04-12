export async function generateEmbeddingsInBatches(allTexts: string[]) {
    const BATCH_SIZE = 15
    let allEmbeddings: number[][] = []

    try {
        for (let i = 0; i < allTexts.length; i += BATCH_SIZE) {
            const textBatch = allTexts.slice(i, i + BATCH_SIZE);
            console.log(`Processing embedding batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allTexts.length / BATCH_SIZE)}...`)

            const response = await fetch('/api/get-embeddings', {
              method: 'POST',
              body: JSON.stringify({
                text: textBatch
              })
            });

            if (!response.ok) {
               console.error("Embedding API failed on batch", response.statusText)
               throw new Error("Failed to fetch embeddings. Rate limit hit?")
            }

            const embeddingResponse = await response.json()
            
            const batchVectors = embeddingResponse.embeddings.embeddings
            allEmbeddings.push(...batchVectors)

            if (i + BATCH_SIZE < allTexts.length) {
                await new Promise((resolve) => setTimeout(resolve, 500))
            }
        }

        console.log('All embeddings fully generated! Total count:', allEmbeddings.length)
        return allEmbeddings;
        
    } catch (error) {
        console.error("Critical error during batch embedding generation:", error)
        throw error;
    }
}
