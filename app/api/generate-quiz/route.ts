import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { quizSchema } from "./schema";

export const POST = async(req : Request) => {
    try {
        const { text, targetCount } = await req.json();
        const requestedCount = Math.max(1, Number(targetCount) || 5);
        
        const result = await generateObject({
            model: openrouter("openai/gpt-oss-120b:free"),
            prompt: text,
            schema: quizSchema,
            system: `You generate multiple-choice quiz questions from the provided document text.

Return a JSON object with a "quiz" array containing EXACTLY ${requestedCount} quiz objects.

Each quiz object must contain:
- index: continuously increasing from 1
- question: a clear question based only on the provided text
- options: exactly 4 options
- each option must have optionIndex 1, 2, 3, and 4
- correctOption: the optionIndex of the single correct option
- explanation: a short explanation of why the correct answer is right
- source: page numbers if they are present in the provided text or metadata

Do not return an empty quiz array. If the text is short, still create practical questions from the available information. Cover the provided content as broadly as possible.`
        })

        const quiz = result.object.quiz;

        if (!Array.isArray(quiz) || quiz.length === 0) {
            return Response.json({
                success: false,
                error: "No quiz questions were generated"
            }, {status: 422});
        }

        return Response.json({
            success: true,
            message: "quiz generated successfully",
            result: quiz
        })
    } catch (error) {
        console.error("error in generating quiz: ", error)
        return Response.json({
            error : "something went wrong while generating quiz"
        }, {status: 500})
    }
}
