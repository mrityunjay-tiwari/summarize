import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { MotionDiv, MotionH2, MotionP, MotionSection } from "../common/motion-wrapper";
import { ContainerVariants } from "@/utils/constants";

export default function CTASection() {
    return (
        <MotionSection variants={ContainerVariants}>
            <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <MotionDiv>
                        <MotionH2 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{duration: 0.5, ease:'easeOut'}} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pb-4">Ready to save hours of reading time?</MotionH2>
                        <MotionP initial={{opacity:0, y:40}} whileInView={{opacity: 1, y: 0}} transition={{duration: 0.5, ease: 'easeOut'}} className="mx-auto max-w-2xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 pb-1">Transform lengthy documents into clear, actionable insights with our AI powered summarizer.</MotionP>
                    </MotionDiv>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                        <MotionDiv initial={{opacity: 0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration: 0.5, ease: 'easeOut'}}>
                            <Button variant={"main"} size={'lg'} className="w-full min-[400px] :w-auto bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-800 transition duration-300 ease-in-out ">
                                <Link href={"/sign-in"} className="flex items-center justify-center px-4"> Get Started <ArrowRight className="ml-4 h-4 w-4 animate-pulse" /> </Link>
                            </Button>
                        </MotionDiv>
                    </div>
                </div>
            </div>
        </MotionSection>
    )
}