import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface EmptySummaryStateProps {
    text : string,
    description: string,
    linkText : string
}

export default function EmptySummaryState({text, description, linkText} :EmptySummaryStateProps) {
    return (
        <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
                <FileText className="w-16 h-16 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 capitalize">{text}</h3>
                <p className="text-gray-500 max-w-md">{description} </p>
                <Button>
                    <Link href={'/upload'} className="hover:cursor-pointer">
                        {linkText}
                    </Link>
                </Button>
            </div>
        </div>
    )
}