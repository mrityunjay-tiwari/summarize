import BgGradient from "@/components/common/bg-gradient";
import EmptySummaryState from "@/components/summaries/empty-summary";
import LimitCountBar from "@/components/summaries/limit-count-bar";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import getSummaries from "@/lib/summaries";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
    const user = await auth();
    const userId = user.userId
    if(!userId) {
        console.log("userId from clerk not found to server summaries")        
        return redirect('/sign-in') 
    }
    console.log(`userId from dashboard/page.tsx ${userId}`);
    
    
    const summaries = await getSummaries(userId)
    console.log(`summari is ${summaries}`);
    
    const uploadLimit = 5
    // const summaries = [
    //     {
    //         id: 1,
    //         title: "Sample title",
    //         created_at: "2025-09-21 05:04:54.919",
    //         summary_text: "description",
    //         status: "completed"
    //     }
    // ]
    return (
        <main className="min-h-screen">
            <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
            <div className="container mx-auto flex flex-col gap-4 w-4/5">
                <div className="px-2 py-12 sm:py-24">
                    <div className="flex gap-4 mb-8 justify-between">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Your Summaries</h1>
                            <p className="text-gray-600">Transform your PDFs into concise, actionable insights</p>
                        </div>
                        {summaries.length <= 5 && <div>
                            <Button className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all duration-300 group">
                                <Link href={'/upload'} className="flex items-center"><PlusIcon className="w-5 h-5 mr-2" /> New Summary</Link>
                            </Button>
                        </div>}
                    </div>
                        {summaries.length >= 5 && <LimitCountBar />}
                        {summaries.length === 0 ? <EmptySummaryState text="No summaries yet" description="Upload your first PDF to get started with AI-powered summaries." linkText="Create your first summary" /> : 
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
                                {summaries?.map((summary, id) => (
                                    <SummaryCard key={id} summary={summary} />
                                ))}
                            </div>
                        }
                </div>
            </div>
        </main>
    )
}