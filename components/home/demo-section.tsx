import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import SummaryCard from "../summaries/summary-card";
import IndividualSummaryViewer from "../summaries/ind-summary-viewer";
import { DEMO_CONTENT } from "@/utils/demo-card";
import { itemVariant } from "@/utils/constants";

export default function DemoSection() {
    return(
        <section className="relative">
            <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 
                    transform-gpu overflow-hidden blur-3xl"
                    >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] 
                        w-[36.125rem] -translate-x-1/2 bg-linear-to-br 
                        from-emerald-500 via-teal-500 to-cyan-500 opacity-30 
                        sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 38.4% 34.7%, 30.5% 17.6%, 20.4% 10.6%, 9% 10%, 27.6% 26.8%, 61.7% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <MotionDiv initial={{y:20, opacity:0}} whileInView={{y: 0,opacity: 1}} className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4 "><Pizza className="w-6 h-6 text-rose-500" /></MotionDiv>
                    <div className="text-center mb-16">
                        <MotionH3 initial={{y:20, opacity:0}} whileInView={{y: 0,opacity: 1}} className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">Watch how SummariZE transforms <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">this NodeJS course PDF</span> into an easy to read summary</MotionH3>
                    </div>
                    <div className="flex justify-center items-center ">
                        <MotionDiv initial={{y:30, opacity:0}} whileInView={{y: 0,opacity: 1}} transition={{ duration: 2, ease: "easeOut" }}>
                            <IndividualSummaryViewer summary={DEMO_CONTENT} />
                        </MotionDiv>
                    </div>
                </div>
            </div>
        </section>
    )
}