import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";
import Headings from "./headings";
import {ImageZoom} from "@/components/kibo-ui/image-zoom";
import Image from "next/image";

export function SystemDesign() {
  return (
    <>
      <div className="max-w-5xl">
        <Headings title="How It works" subtitle="System Design" subheading="Not just another RAG Pipeline." />
        <div className="p-10 rounded-xl bg-white dark:bg-zinc-900 min-w-6xl flex justify-self-center">
          <ImageZoom>
            <Image
              alt="system design image"
              className="h-auto w-full rounded-xl backdrop-blur-2xl shadow-md"
              height={800}
              src="https://ik.imagekit.io/mrityunjay/DocuMind/sd.jpg"
              unoptimized
              width={1500}
            />
          </ImageZoom>
        </div>
      </div>
    </>
  );
}
