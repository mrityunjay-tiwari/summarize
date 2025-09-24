import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

export default function UploadHeader() {
    return (
        <div className="w-full justify-items-center">
            <div className="">
                <div className="flex pb-4">
                    <div
                        className="relative p-[1px] overflow-hidden
                    rounded-full bg-linear-to-r from-rose-200 via-rose-500
                    to-rose-800 animate-gradient-x group"
                    >
                        <Badge
                        variant={"secondary"}
                        className="relative px-6 py-2 text-base font-medium
                        bg-white rounded-full group-hover:bg-gray-50
                        transition-colors duration-200"
                        >
                        <Sparkles
                            className="h-10 w-10 mr-2 text-rose-600
                        animate-pulse"
                        />
                        <p className="text-base text-rose-600">AI Powered content creation</p>
                        </Badge>
                    </div>
                </div>
            </div>

            <h1 className="font-bold text-3xl py-6 text-center ">
                Start Uploading{" "}
                <span className="relative inline-block">
                    <span className="relative z-10 px-2">Your PDFs</span>
                    <span
                        className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-1"
                        aria-hidden="true"
                    ></span>
                </span>{" "}
            </h1>
            <div className="flex gap-2 items-center">
                <h2 className="text-lg sm:text-lg lg:text-lg text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
                    Upload your pdf and let our AI do the magic !! 
                </h2>
                <Sparkles className="h-5 w-5 text-yellow-900" />
            </div>
            <div>
                <h1 className="text-sm pt-6 text-gray-600">--------Uploadform--------</h1>
            </div>
        </div>
    )
}