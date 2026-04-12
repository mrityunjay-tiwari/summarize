import {ArrowRight, FileText, Zap, Code, Upload} from "lucide-react";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden mx-auto max-w-4xl mt-16 pb-16 text-center z-10 px-4">
      <section className="flex flex-col items-center">
        {/* PILL BADGE */}
        <div className="flex">
          <div className="shadow-lg relative overflow-hidden rounded-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 group">
            <Badge
              variant="secondary"
              className="border border-b-0 border-gray-50 relative px-4 py-2 text-sm bg-white/80 backdrop-blur-md rounded-full group-hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 text-gray-700 cursor-pointer shadow-sm"
            >
              <span
                className="shrink-0 block rounded-full animate-pulse"
                style={{width: 8, height: 8, backgroundColor: "#22c55e"}}
              ></span>
              Now mind maps are also available
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Badge>
          </div>
        </div>

        {/* MAIN HEADING */}
        <h1 className="mt-8 font-medium text-6xl tracking-tight text-slate-900 leading-[1.1]">
          Turn any PDF into <br className=" sm:block" />
          <span className="font-normal text-5xl bg-linear-to-r from-gray-800 via-gray-600 to-gray-400 bg-clip-text text-transparent inline-block">
            Your Ultimate Study Guide
          </span>
        </h1>

        {/* SUBHEADING */}
        <h2 className="mt-6 lg:text-lg text-muted-foreground max-w-2xl">
          Upload your documents, textbooks, lecture slides, or research paper PDFs. DocuMind's
          AI instantly generates <span className="font-medium">flashcards</span>, <span className="font-medium">quizzes</span>, <span className="font-medium">mind maps</span>, and <span className="font-medium">lets you chat</span> with your documents in seconds.
        </h2>

        {/* FEATURE CARDS */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5 w-full max-w-3xl">
          {/* Card 1: Powered by Docling */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 text-left flex-1 shadow-md transition-shadow">
            <div className="rounded-lg bg-orange-100 p-2 text-orange-500">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium  text-slate-900">
                Powered by Docling
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                Flawlessly extracts complex tables & scanned documents.
              </p>
            </div>
          </div>

          {/* Card 2: Instant Results */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-4 text-left flex-1 shadow-md transition-shadow">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">
                Instant AI Generation
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                Flashcards, quizzes, mind maps and live chat ready in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/upload" className="w-full sm:w-auto">
            <Button className="w-full shadow-md">
              <Upload className="mr-2 h-4 w-4" /> Upload PDF
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full bg-white text-slate-900 opacity-100 shadow-xs border-gray-200 hover:bg-gray-50">
              <Code className="mr-2 h-4 w-4 text-slate-500" /> View Example Output
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
