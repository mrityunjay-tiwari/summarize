import {ArrowRight, Sparkles} from "lucide-react";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionSection,
  MotionSpan,
} from "../common/motion-wrapper";
import {Badge} from "../ui/badge";
import CardStack from "./stack";
import {Button} from "../ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className=" relative mx-auto flex w-full max-w-7xl justify-between items-center gap-10 mt-20">
      <MotionSection
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 0.5, ease: "easeOut"}}
      >
        <div className="">
          <div className="flex pb-4">
            <MotionDiv
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, ease: "easeOut"}}
              className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-sky-500 to-sky-800 animate-gradient-x group"
            >
              <Badge
                variant={"secondary"}
                className="relative px-4 py-0.5 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200"
              >
                <Sparkles className="h-6 w-6 mr-2 text-blue-400 animate-pulse" />
                <p className="text-sm text-blue-400">Powered by AI</p>
              </Badge>
            </MotionDiv>
          </div>
        </div>
        <MotionH1
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.5, ease: "easeOut"}}
          className="font-bold text-2xl md:text-4xl pt-5 pb-4 text-start"
        >
          Transform PDFs/YouTube Videos into{" "}
          <span className="relative inline-block">
            <MotionSpan
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, ease: "easeOut"}}
              className="relative z-10 px-2"
            >
              concise
            </MotionSpan>
            <span
              className="absolute inset-0 bg-blue-200/50 -rotate-2 rounded-lg transform -skew-1 "
              aria-hidden="true"
            ></span>
          </span>{" "}
          summaries{" "}
        </MotionH1>
        <MotionH2
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.5, ease: "easeOut"}}
          className="text-lg sm:text-xl lg:text-xl text-start px-4 lg:px-0 lg:max-w-4xl text-gray-600 mt-5"
        >
          Get flash cards of what you study in seconds.
        </MotionH2>
        <MotionDiv
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.5, ease: "easeOut"}}
          className="pt-16"
        >
          <Button
            variant={"shbtm"}
            size={"lg"}
            className="rounded-full text-white bg-linear-to-r from-slate-900 to-blue-400 hover:from-blue-400 hover:to-slate-900 transform transition duration-700 ease-in-out"
          >
            <Link href={"/dashboard"} className="flex gap-2 items-center">
              <MotionSpan>Try SummariZE</MotionSpan>
              <ArrowRight className="animate-pulse" />
            </Link>
          </Button>
        </MotionDiv>
      </MotionSection>

      <div className="">
        <CardStack />
      </div>
    </div>
  );
}
