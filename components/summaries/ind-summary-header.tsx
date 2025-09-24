import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

export default function IndSummaryHeader({
  title, createdAt, readingTime
}: {
  title: string | undefined | null;
  createdAt: Date | undefined, 
  readingTime: number
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">

        {/* Three badges */}
        <div className="flex gap-2">
            {/* Badge 1 */}
          <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm 
                        font-medium bg-white/80 backdrop-blur-xs 
                        rounded-full hover:bg-white/90 transition-all 
                        duration-200 shadow-xs hover:shadow-md"
          >
            <Sparkles
              className="h-4 w-4 mr-1.5 
                            text-rose-500"
            />
            AI Summary
          </Badge>

            {/* Badge 2 */}
            <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm 
                        font-medium bg-white/80 backdrop-blur-xs 
                        rounded-full hover:bg-white/90 transition-all 
                        duration-200 shadow-xs hover:shadow-md"
            >
            <Calendar
                className="h-4 w-4 mr-1.5 
                            text-rose-500"
            />
            {new Date(createdAt!).toLocaleDateString('en-US', {
                year: "numeric",
                month: "short",
                day: "numeric"
            })}
            </Badge>

            {/* Badge 3 */}
            <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm 
                        font-medium bg-white/80 backdrop-blur-xs 
                        rounded-full hover:bg-white/90 transition-all 
                        duration-200 shadow-xs hover:shadow-md"
            >
            <Clock
                className="h-4 w-4 mr-1.5 
                            text-rose-500"
            />
            {readingTime} minutes
            </Badge>
            
          
        </div>
        
        {/* Back to Dashboard button */}
         <div>
            <Link href={"/dashboard"}>
            <Button
                size={"sm"}
                className="group flex items-center gap-1 sm:gap-2 hover:bg-rose-50/80 hover:scale-105 hover:underline underline-offset-2
                        backdrop-blur-xs rounded-full transition-all
                        duration-300 shadow-xs hover:shadow-md border
                        border-rose-100/30 bg-rose-100 text-rose-700 p-2 sm:px-3 text-xs"
            >
                <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />

                <span>Back {' '}<p className="hidden sm:inline">to dashboard</p></span>
            </Button>
            </Link>
        </div>

      </div>

        <div>
            <h1 className="text-2xl lg:text-4xl font-bold lg:tracking-tight">
                <span className="bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                    {title}
                </span>
            </h1>
        </div>
    </div>
  );
}
