'use server'

import { prisma } from "@/prisma/src/index"
import { auth } from "@/utils/auth"
import { formatFileNameAsTitle } from "@/utils/format-utils"
import { revalidatePath } from "next/cache"
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

type UploadedFile = {
  ufsUrl: string;
  name: string;
}

interface savePDFSummaryProps {
    user_id?: string,                 
    original_file_urll: string,
    summary_text: string,
    statuss?: string,                     
    title: string,
    file_name: string,
}

async function savePDFSummary({
  original_file_urll,
  summary_text,
  title,
  file_name,
}: savePDFSummaryProps) {

  const session = await CheckIfUserExists();

  if(!session) {
    return {
        success: false,
        message: "session not found"
    }
  }

  const summary = await prisma.pdfSummary.create({
    data: {
      user_id: session,
      original_file_url: original_file_urll,
      summary_text,
      title,
      file_name,
    },
  });

  return { summary };
}

// export async function storeSummary({user_id, file_name, original_file_urll, summary_text, title} : savePDFSummaryProps) {
//     let pdfSummary: any;
//     try {
//         const userId = await auth();
//         if(!userId) {
//             return {
//                 success: false,
//                 message: "User not found"
//             }
//         }
//         console.log("userid : ");
//         console.log({userId});
        
//         // user_id is now handled inside savePDFSummary via auth()
//         pdfSummary = await savePDFSummary({original_file_urll, summary_text, title, file_name, user_id})
//         console.log("pdfSummary is :");
//         console.log(pdfSummary);
//         console.log("pdfSummary.summary.id is : ");
//         console.log(pdfSummary.summary.id) 
        
        
         
//         if(!pdfSummary) {
//             return {
//                 success: false,
//                 message: "failed to save pdf summary, please try again"
//             }
//         }

//         console.log("we have pdfSummary and it is being saved");
        
//         revalidatePath(`/summaries/${pdfSummary.summary.id}`)
//         return {
//             success: true,
//             message:"pdf summary saved successfully",
//             data: {
//                 id: pdfSummary.summary.id
//             }
//         }
        
//     } catch (error) {
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : "Error saving PDF summary"
//         }
//     }

    
// }