import Link from "next/link";
import { Card } from "../ui/card";
import DeleteButton from "./delete-button";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";


const StatusBadge = ({status}: {status: string}) => {
    return <span className={cn('px-3 py-1 text-xs font-medium rounded-full capitalize', status == "completed" ? "bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800")}>{status}</span>
}

interface summaryCardProps {
  summary: {
    id: string;
    title: string | null;      // allow null from Prisma
    created_at: Date;          // Prisma returns Date, not string
    summary_text: string;
    status: string;
    file_name?: string | null; // optional if you use it
    original_file_url?: string;
    user_id?: string | null;
    updated_at?: Date;
  };
}

export default function SummaryCard({ summary }: summaryCardProps) {
    const timePassed = Math.floor(((new Date().getTime()) - (new Date(summary.created_at).getTime()))/ (1000 * 60))
  return (
    <div>
      <Card className="relative h-full">
        <span className="absolute top-2 right-2">
            <DeleteButton summaryId={summary.id} />
        </span>
        <Link href={`/summaries/${summary.id}`} className="block pl-6">
        
          
          <div className="flex flex-col gap-3 sm:gap-4">

            <div className="flex items-center gap-2 sm:gap-4">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mt-1" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
                    {summary.title}{" "}
                    </h3>
                    {/* <p className="text-sm text-gray-500">{new Date(summary.created_at).toLocaleDateString()}</p> */}
                    {timePassed < 60 ? <p className="text-sm text-gray-500">{Math.floor(((new Date().getTime()) - (new Date(summary.created_at).getTime()))/ (1000 * 60))} minutes ago </p> : <p className="text-sm text-gray-500">{Math.floor(((new Date().getTime()) - (new Date(summary.created_at).getTime()))/ (1000 * 60 * 60))} hours ago</p> }
                </div>
            </div>
            

            <p className="text-gray-600 line-clamp-2 text-sm sm:text-base pl-2">{summary.summary_text}</p>
            
            <div className="flex justify-between items-center mt-2 sm:mt-4">
                <StatusBadge status={summary.status} />
            </div>
          
          </div>
        </Link>
      </Card>
    </div>
  );
}
