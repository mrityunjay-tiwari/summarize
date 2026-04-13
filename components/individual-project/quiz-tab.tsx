import { PlusIcon } from "lucide-react";
import { SortableExample } from "../examples/sortable";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SiQuizlet } from "react-icons/si";

export function QuizTab() {
    return (
        <div className="min-w-full">
            <div className="max-w-full flex justify-between items-center px-6 mt-1 bg-blue-300/10 rounded-lg p-4 mx-5">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-2 rounded-lg shadow-md"><SiQuizlet className="size-4 text-blue-500" /></div>
                    <span className="text-sm font-medium">Quizzes are fun !!</span>
                </div>
                <div>
                    <Button size={"xs"} variant={"outline"} className="rounded-full shadow-md">
                        <PlusIcon /> Generate More
                    </Button>
                </div>
            </div>
            <Separator className="mt-4 mx-6 opacity-40" />
            <SortableExample />
        </div>
    )
}