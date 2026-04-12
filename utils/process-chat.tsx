import { saveChatReadyDocument } from "@/actions/upload-actions";
import { generateEmbeddingsInBatches } from "./generate-embeddings-client";
import { TChunkSchema } from "@/types/chunk-schema";

export interface TUploadedFile {
    ufsUrl: string;
    url: string;
    name: string;
    key: string;
    size: number;
}

export const processChatUpload = async (uploadedFile: TUploadedFile) => {
    try {
        console.log("Starting Chat Processing for: ", uploadedFile.name);
        
        const pythonApiUrl = `https://mrityunjay18-structured-pdf-retrieval.hf.space/get-chunks?source=${uploadedFile.ufsUrl}`;
        console.log("Calling Python Engine: ", pythonApiUrl);
        
        const fileText = await fetch(pythonApiUrl);
        const fileJson = await fileText.json();
        
        const chunks = fileJson.chunks;
        const allTexts = chunks.map((chunk: TChunkSchema) => chunk.text);
        console.log(`Extracted ${allTexts.length} chunks. Generating embeddings...`);
        
        const allEmbeddings = await generateEmbeddingsInBatches(allTexts);

        const finalEmbeddingData = chunks.map((chunk: TChunkSchema, index: number) => {
            return {
                text: chunk.text,
                meta: chunk.meta,
                embedding: allEmbeddings[index],
            };
        });

        console.log("Embeddings successfully stitched to chunks. Saving to Database...");

        const saveChatReadyDocumentResponse = await saveChatReadyDocument({
            original_file_url: uploadedFile.ufsUrl,
            file_name: uploadedFile.name,
            file_key: uploadedFile.key,
            finalEmbeddingData,
        });

        console.log("Final Database Response: ", saveChatReadyDocumentResponse);
        
        return saveChatReadyDocumentResponse;
        
    } catch (error) {
        console.error("Critical error inside processChatUpload:", error);
        throw error;
    }
}