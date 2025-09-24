'use server'

import { generateSummaryFromGemini } from "@/lib/gemini"
import { fetchAndExtractPDFText } from "@/lib/langchain"
import { prismaClient } from "@/prisma/src/index"
import { formatFileNameAsTitle } from "@/utils/format-utils"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

interface uploadResponseProps {
    serverData : {
        userId: string,
        file: {
            url: string,
            name: string
        }
    }
}

export async function generateSummary(uploadResponse: uploadResponseProps[]) {
    if(!uploadResponse) {
        return {
            success: false,
            message: "file upload failed",
            data: null
        }
    }
    console.log('uploadResponse : ', uploadResponse );
    console.log('uploadResponse[0] : ', uploadResponse[0]);    
    const {serverData: {userId, file: {url: pdfUrl, name: filename}}} = uploadResponse[0]
    
    console.log('pdfUrl from upload-actions - ', pdfUrl);
    
    
    if(!pdfUrl) {
        return {
            success: false,
            message: "no pdf url received",
            data: null
        }
    }

    try {
        const pdfText = await fetchAndExtractPDFText(pdfUrl)
        console.log({pdfText});

        let summary;
        try {
            summary = await generateSummaryFromGemini(pdfText)
            console.log("summary from gemini : ");            
            console.log(summary);
            
        } catch (err) {
            console.log(err);
            
        }

        if(!summary) {
            return {
                success: false,
                message: "no pdf url received",
                data: null 
            }
        }
        
        const fileFormatedName = formatFileNameAsTitle(filename)
        return {
            success: true,
            message: "summary generated successfully",
            data: {
                title: fileFormatedName,
                summary
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "no pdf url received",
            data: null
        }
    }
}

interface savePDFSummaryProps {
    user_id?: string,                 
    original_file_urll: string,
    summary_text: string,
    statuss?: string,                     
    title: string,
    file_name: string,
}

async function savePDFSummary({user_id, original_file_urll, summary_text, title, file_name} : savePDFSummaryProps) {
    try {
        if(!user_id) {
            return {
                message: "userid not found"
            }
        }
        
        console.log("user_id is : ");
        console.log(user_id);
        
        const summary = await prismaClient.pdfSummary.create({
            data: {
                user_id: user_id,                 
                original_file_url: original_file_urll,
                summary_text: summary_text,                   
                title: title,
                file_name: file_name,
            }
        })

        console.log("summary is : ");
        console.log({summary});
        console.log("summayId from savePDFSummary is : ");
        console.log(summary.id);

        return {summary}
                
    } catch (error) {
        console.error("Error saving PDF summary", error)
        throw error;        
    }

   
}

export async function storeSummary({user_id, file_name, original_file_urll, summary_text, title} : savePDFSummaryProps) {
    let pdfSummary: any;
    try {
        const userId = await auth();
        if(!userId) {
            return {
                success: false,
                message: "User not found"
            }
        }
        console.log("userid : ");
        console.log({userId});
        
        pdfSummary = await savePDFSummary({user_id, file_name, original_file_urll, summary_text, title})
        console.log("pdfSummary is :");
        console.log(pdfSummary);
        console.log("pdfSummary.summary.id is : ");
        console.log(pdfSummary.summary.id) 
        
        
         
        if(!pdfSummary) {
            return {
                success: false,
                message: "failed to save pdf summary, please try again"
            }
        }

        console.log("we have pdfSummary and it is being saved");
        
        revalidatePath(`/summaries/${pdfSummary.summary.id}`)
        return {
            success: true,
            message:"pdf summary saved successfully",
            data: {
                id: pdfSummary.summary.id
            }
        }
        
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error saving PDF summary"
        }
    }

    
}