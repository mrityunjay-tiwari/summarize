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

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
            file_size: formatBytes(uploadedFile.size),
            finalEmbeddingData,
        });

        console.log("Final Database Response: ", saveChatReadyDocumentResponse);
        
        return saveChatReadyDocumentResponse;
        
    } catch (error) {
        console.error("Critical error inside processChatUpload:", error);
        throw error;
    }
}