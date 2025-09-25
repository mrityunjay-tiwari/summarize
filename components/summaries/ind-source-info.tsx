import { ExternalLink, FileText } from "lucide-react"
import { Button } from "../ui/button"
import DownloadSummaryButton from "./download-summary"
import { MotionDiv } from "../common/motion-wrapper"

interface IndSourceInfoProps {
    fileName: string, 
    original_file_url: string,
    title: string,
    summary_text: string,
    created_at: Date
}
export default function IndSourceInfo({fileName, original_file_url, title, summary_text, created_at} : IndSourceInfoProps) {
    return (
        <MotionDiv initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y:0}} transition={{duration:0.5, ease: 'easeOut'}} className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4 text-rose-400" />
            <span>Source: {fileName}</span>
        </div>
        <div className="flex gap-2">
            <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            asChild
            >
            <a href={original_file_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Original
            </a>
            </Button>
            <DownloadSummaryButton created_at={created_at} file_name={fileName} summary_text={summary_text} title={title} />
        </div>
        </MotionDiv>

    )
}