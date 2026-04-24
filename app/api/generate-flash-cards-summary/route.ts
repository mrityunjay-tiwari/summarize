import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { flashCardStackSchema } from "./schema";

export const POST = async (req : Request) => {
    try {
        const { text, targetCount } = await req.json();

        const result = await generateObject({
            model: openrouter("openai/gpt-oss-120b:free"),
            prompt: text,
            schema: flashCardStackSchema,
            system: `Given the text content you need to generate flash cards. Return a JSON object containing a 'flashCards' array with EXACTLY ${targetCount || 5} objects where each has an index. Each index should be continuously increasing starting from 1 (this will help in identifying the order of the flash cards). One question and answer in each object on the basis of the content provided by the user.`
        })

        return Response.json({
            success: true,
            message: "summary generated successfully",
            result: result.object.flashCards
    })
    } catch (error) {
        console.error(error);
        return Response.json({
            error: "Something went wrong while generating flash cards",
        }, {status: 500})
    }
}