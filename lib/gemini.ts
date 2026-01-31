import OpenAI from "openai";

import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from "@/utils/prompt";
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

export async function generateSummaryFromGemini(pdfText : string) {

    try {
        const response = await client.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: `Transform this document into an engaging, easy-to-read summary with proper markdown summary ${pdfText}.`
            }
        ],
        temperature: 0.7,
        max_completion_tokens: 1500
        });

       
        return response.choices[0].message.content 
    } catch (error) {
        console.error("OpenRouter error:", error);
        throw new Error("Failed to generate summary from LLM");
    }
}