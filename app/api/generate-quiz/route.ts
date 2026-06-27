import { openrouter } from "@openrouter/ai-sdk-provider";
import { quizSchema, type QuizSchema } from "./schema";
import { coercePageSource, generateResilient } from "@/utils/structured-generation";

type QuizQuestion = QuizSchema["quiz"][number];

function cleanTextForQuiz(text: string) {
    return text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_\-[\]()`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getCandidateSentences(text: string) {
    const cleaned = cleanTextForQuiz(text);
    const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length >= 45 && sentence.length <= 260);

    if (sentences.length > 0) return sentences;

    const chunks = cleaned.match(/.{80,220}(?:\s|$)/g) || [];
    return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

function truncateOption(text: string) {
    return text.length > 150 ? `${text.slice(0, 147).trim()}...` : text;
}

// Coerce arbitrary model JSON into the predefined quiz schema, keeping only
// questions that can form a valid 4-option MCQ.
function normalizeQuiz(raw: unknown): QuizSchema | null {
    const arr = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object" && Array.isArray((raw as { quiz?: unknown }).quiz)
          ? (raw as { quiz: unknown[] }).quiz
          : null;
    if (!arr) return null;

    const quiz: QuizQuestion[] = [];
    for (const item of arr) {
        if (!item || typeof item !== "object") continue;
        const obj = item as Record<string, unknown>;

        const question = typeof obj.question === "string" ? obj.question.trim() : "";
        if (!question) continue;

        const rawOptions = Array.isArray(obj.options) ? obj.options : [];
        const optionTexts: string[] = [];
        for (const o of rawOptions) {
            const optText =
                typeof o === "string"
                    ? o
                    : o && typeof o === "object" && typeof (o as { option?: unknown }).option === "string"
                      ? ((o as { option: string }).option)
                      : "";
            if (optText.trim()) optionTexts.push(truncateOption(optText.trim()));
            if (optionTexts.length === 4) break;
        }
        if (optionTexts.length < 4) continue; // schema requires exactly 4

        const options = optionTexts.map((option, i) => ({ optionIndex: i + 1, option }));

        let correctOption = Number(obj.correctOption);
        if (!Number.isFinite(correctOption) || correctOption < 1 || correctOption > 4) {
            correctOption = 1;
        }

        const explanation =
            typeof obj.explanation === "string" && obj.explanation.trim()
                ? obj.explanation.trim()
                : "Based on the provided document content.";

        quiz.push({
            index: quiz.length + 1,
            question,
            options,
            correctOption,
            explanation,
            source: coercePageSource(obj.source),
        });
    }

    return quiz.length > 0 ? { quiz } : null;
}

// Deterministic, model-free fallback derived from the document text.
function createFallbackQuiz(text: string, count: number): QuizQuestion[] {
    const candidates = getCandidateSentences(text);
    if (candidates.length === 0) return [];

    const fallbackDistractors = [
        "It introduces an unrelated concept not supported by the document.",
        "It contradicts the main explanation given in the document.",
        "It focuses on a minor detail instead of the central idea.",
    ];

    return Array.from({ length: count }).map((_, index) => {
        const correctSentence = candidates[index % candidates.length];
        const distractorPool = candidates.filter((_, i) => i !== index % candidates.length);
        const distractors = [...distractorPool, ...fallbackDistractors].slice(0, 3);

        while (distractors.length < 3) {
            distractors.push(fallbackDistractors[distractors.length % fallbackDistractors.length]);
        }

        return {
            index: index + 1,
            question: "Which statement is supported by the provided document content?",
            options: [
                { optionIndex: 1, option: truncateOption(correctSentence) },
                { optionIndex: 2, option: truncateOption(distractors[0]) },
                { optionIndex: 3, option: truncateOption(distractors[1]) },
                { optionIndex: 4, option: truncateOption(distractors[2]) },
            ],
            correctOption: 1,
            explanation: `The correct answer is directly based on this document excerpt: ${truncateOption(correctSentence)}`,
        };
    });
}

export const POST = async (req: Request) => {
    let text = "";
    let requestedCount = 5;

    try {
        const body = await req.json();
        text = typeof body.text === "string" ? body.text : "";
        requestedCount = Math.min(10, Math.max(1, Number(body.targetCount) || 5));

        const { data } = await generateResilient<QuizSchema>({
            model: openrouter("openai/gpt-oss-120b:free"),
            prompt: text,
            schema: quizSchema,
            normalize: normalizeQuiz,
            fallback: () => ({ quiz: createFallbackQuiz(text, requestedCount) }),
            system: `You generate multiple-choice quiz questions from the provided document text.

Return a JSON object with a "quiz" array containing EXACTLY ${requestedCount} quiz objects.

Each quiz object must contain:
- index: continuously increasing from 1
- question: a clear question based only on the provided text
- options: exactly 4 options
- each option must have optionIndex 1, 2, 3, and 4
- correctOption: the optionIndex of the single correct option
- explanation: a short explanation of why the correct answer is right

Do not return an empty quiz array. If the text is short, still create practical questions from the available information. Cover the provided content as broadly as possible.`,
        });

        if (!data.quiz || data.quiz.length === 0) {
            return Response.json(
                { success: false, error: "No quiz questions were generated because the provided text was empty or unreadable." },
                { status: 422 }
            );
        }

        return Response.json({
            success: true,
            message: "quiz generated successfully",
            result: data.quiz,
        });
    } catch (error) {
        console.error("error in generating quiz: ", error);

        const fallbackQuiz = createFallbackQuiz(text, requestedCount);
        if (fallbackQuiz.length > 0) {
            return Response.json({
                success: true,
                message: "quiz generated successfully using fallback generation",
                result: fallbackQuiz,
            });
        }

        return Response.json(
            { success: false, error: "Unable to generate quiz because the provided text was empty or unreadable." },
            { status: 500 }
        );
    }
};
