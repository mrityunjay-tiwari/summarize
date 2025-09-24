"use server"

import { prismaClient } from "@/prisma/src"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

interface deleteSummaryProps {
    summaryId : string
}
export async function deleteSummaryAction({summaryId} : deleteSummaryProps) {
    try {
        const user = await auth()
        const idOfUserForDeletion = user.userId

        if(!idOfUserForDeletion) {
            throw new Error ('user not found')
        }
        const summaryToDelete = await prismaClient.pdfSummary.delete({
            where: {
                id: summaryId,
                user_id: idOfUserForDeletion
            },
            
        })

        if(!summaryToDelete) {
            return {
                success: false
            }
        }

        revalidatePath('/dashboard')
        return {
            success: true
        }

    } catch (error) {
        console.error("error deleting summary", error)
        return {
            success: false,
            message: "Unable to delete the summary"
        }
    }
}