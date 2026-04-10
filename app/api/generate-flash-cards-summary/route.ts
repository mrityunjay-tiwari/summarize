import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { flashCardStackSchema } from "./schema";

export const POST = async (req : Request) => {
    try {
        const {pdfFile} = await req.json();

        const result = await generateObject({
            model: openrouter("arcee-ai/trinity-large-preview:free"),
            prompt: pdfFile,
            schema: flashCardStackSchema,
            system: "Given the text content you need to generate an flash cards, return a JSON object containing a 'flashcards' array with around 10-15 objects where each has an index each index should be continuously increasing strarting from 1 (continuing to 2,3,4,5 so on depending on the number of objects thereby, this will help in identifying the order of the flash cards) one question and answer in each object on the basis of the content provided by the user."
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