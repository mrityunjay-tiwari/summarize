'use server'

import { prisma } from "@/prisma/src/index"
import CheckIfUserExists from "./checkUser"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi();
export const deletePdfFile = async () => {
    try {
        await utapi.deleteFiles("u8y7IgAVRiC1wG4Z5AV2Mu5S7XE1QzkTCcib0N3ZFdejfKLH");
        console.log('file deleted successfully');    
    } catch (err) {
        console.log("error : ", err);
    } finally {
        console.log('sth done with deleted button execution');
    }
}

type TFinalEmbeddingData = {
    text: string;
    meta: JSON;
    embedding: number[];
}

type TSaveChatReadyDocumentProps = {
    original_file_url: string;
    file_name: string;
    file_key: string;
    finalEmbeddingData: TFinalEmbeddingData[];
}

export async function saveChatReadyDocument({
    original_file_url,
    file_name,
    file_key,
    finalEmbeddingData
}: TSaveChatReadyDocumentProps) {
    try {
        const userId = await CheckIfUserExists();

        if(!userId) {
            return { success: false, message: "User not authenticated" };
        }

        console.log("Creating base Document in DB...");
        const newDoc = await prisma.document.create({
            data: {
                user_id: userId,
                original_file_url,
                file_name,
                file_key,
            }
        });

        console.log(`Base Document Created: ${newDoc.id}. Inserting ${finalEmbeddingData.length} chunks with vectors...`);

        const sqlOperations = finalEmbeddingData.map((chunk) => {
            const newChunkId = crypto.randomUUID(); 
            const stringifiedVector = JSON.stringify(chunk.embedding);
            
            return prisma.$executeRaw`
                INSERT INTO "DocumentChunk" (id, document_id, text, metadata, embedding, created_at)
                VALUES (${newChunkId}, ${newDoc.id}, ${chunk.text}, ${chunk.meta}::jsonb, ${stringifiedVector}::vector, NOW())
            `;
        });

        await prisma.$transaction(sqlOperations);
        
        console.log(`Successfully saved ${finalEmbeddingData.length} vectorized chunks!`);
        
        return { 
            success: true, 
            message: "Chat document indexed and saved.", 
            document_id: newDoc.id 
        };

    } catch (error) {
        console.error("Error saving Chat Document: ", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Database Error while saving embeddings."
        }
    }
}