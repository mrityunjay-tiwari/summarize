import OpenAI from "openai";

import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "@/utils/prompt";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function generateSummaryFromGemini(pdfText : string) {

    try {
        const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown summary ${pdfText}`
            }
        ],
        temperature: 0.7,
        max_completion_tokens: 1500
        });

        return response.choices[0].message.content
    } catch (error) {
        console.log('error', error);
        
    }
}