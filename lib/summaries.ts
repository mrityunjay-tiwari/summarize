import { prismaClient } from "@/prisma/src";

export default async function getSummaries(userId: string) {
    const summary = await prismaClient.pdfSummary.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created_at: 'desc',
            
        }
    })
    console.log(`summary from prisma Client : ${summary}`);
    
    return summary
} 

export async function getIndividualSummary({userId, summaryId}: {userId : string, summaryId: string}) {
    const individualSummary = await prismaClient.pdfSummary.findUnique({
        where: {
            user_id: userId,
            id: summaryId
        }
    })

    console.log(individualSummary?.id);
    
    return individualSummary
}