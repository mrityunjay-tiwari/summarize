import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/utils/prompt";

export async function generateSummaryFromGemini(pdfText: string) {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPEN_ROUTER_API_KEY is not defined");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Summarize App",
    },
  });

  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Transform this document into an engaging, easy-to-read summary with proper markdown.\n\n${pdfText.slice(0, 12000)}`,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 1500,
    });

    if (!response.choices?.length) {
      throw new Error("No choices returned from OpenRouter");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error);
    throw error;
  }
}
