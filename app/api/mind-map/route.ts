import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { mindMapSchema } from "./schema";

export const POST= async(req: Request) => {
    try {
        const {pdfFile} = await req.json();

    const result = await generateObject({
        model: openrouter("arcee-ai/trinity-large-preview:free"),
        prompt: pdfFile,
        schema: mindMapSchema,
        system: "You need to generate a mind map on the basis of the given content, the mind map is a tree like structure where you will start with one major point or subject discussed in the given content and then you will have sub-points branching out from the main point and then further sub-points branching out from the sub-points and so on, the sub-points should be relevant to the topic they are branching out from, the sub-points should be in the format of an array of objects where each object has an index each index should be continuously increasing strarting from 1 (continuing to 2,3,4,5 so on depending on the number of objects thereby, this will help in identifying the order of the mind map). The mind map should cover the entire content of the pdf. Each points should be short snippet of words and not very long ones, each point should be in the range of 5-10 words maximum. Note that at first there will be only one point in the array and then it will branch out to few (say 3-4 subpoints of that and then each subpoint will further have some subpoint and so on), the layer need not go more than 2-4 nesting levels depending on what is required in case. Note the first step should have strictly one point only in the array and it should be the main topic of the pdf and further we can have as many subpoints as required."
    })

    return Response.json({
        success: true,
        message: "mind map generated successfully",
        result: result.object.mindMap,
        topic: result.object.topic
    })
    } catch (error) {
        console.error("error : ", error)
        return Response.json({
            error: "something went wrong while generating mind map"
        }, {status: 500})
    }
}