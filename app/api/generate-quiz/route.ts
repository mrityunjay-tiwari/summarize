import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { quizSchema } from "./schema";

export const POST = async(req : Request) => {
    try {
        const { text, targetCount } = await req.json();
        
        const result = await generateObject({
            model: openrouter("openai/gpt-oss-120b:free"),
            prompt: text,
            schema: quizSchema,
            system: `Given the text content you need to generate a quiz, it will be an array with EXACTLY ${targetCount || 5} objects where each has an index. Each index should be continuously increasing starting from 1 (this will help in identifying the order of the quiz questions). One question and 4 options (each option has its optionIndex as continuously increasing starting from 1,2,3,4) for each question out of which strictly only one is the correct option and also return the correctOption, the correction is to be returned in the format as return the optionIndex of the correct option in each object. Ask questions on the basis of the content provided by the user. The questions should be such that they cover the entire content of the text provided.`
        })

        return Response.json({
            success: true,
            message: "quiz generated successfully",
            result: result.object.quiz
        })
    } catch (error) {
        console.error("error in generating quiz: ", error)
        return Response.json({
            error : "something went wrong while generating quiz"
        }, {status: 500})
    }
}