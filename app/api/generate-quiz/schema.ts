import z from "zod";

export const quizSchema = z.object({
    quiz: z.array(
        z.object({
            index: z.number(),
            question: z.string(),
            options: z.array(
                z.object({
                    optionIndex: z.number(),
                    option: z.string()
                })
            ).length(4),
            correctOption: z.number()
        })
    )
})