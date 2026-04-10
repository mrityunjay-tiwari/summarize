import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { quizSchema } from "./schema";

export const POST = async(req : Request) => {
    try {
        const {pdfFile} = await req.json();
        
        const result = await generateObject({
            model: openrouter("arcee-ai/trinity-large-preview:free"),
            prompt: pdfFile,
            schema: quizSchema,
            system: "Given the text content you need to generate an quiz, it will be an array with around 10-15 objects where each has an index each index should be continuously increasing strarting from 1 (continuing to 2,3,4,5 so on depending on the number of objects thereby, this will help in identifying the order of the quiz questions) one question and 4 options (each option has it's index as continuously increasing starting from 1,2,3,4) for each question out of which strictly only one is the correct option and also return me the correct option, the correction is to be returned in the format as return the optionIndex of the correct option in each object. Ask questions on the basis of the content provided by the user. The questions should be such that they cover the entire content of the pdf."
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