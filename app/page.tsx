import ChatBotOpenButton from "@/components/chatbot/chatbot-openButton";
import { AccordionDemo } from "@/components/home/accordion";
import CTA from "@/components/home/cta";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import ScrollableCardStackDemo from "@/components/home/sections-stack";
import { SystemDesign } from "@/components/home/system-design";
import { Navbar } from "@/components/navbar/nav";
import BGGrid from "@/components/ui/bg-pattern";
import { auth } from "@/utils/auth";

export default async function Home() {
  const user = await auth();
  return (
    <div className="flex flex-col">
      <Navbar user={user} />
      <BGGrid />
      <div className="mt-16">
        <Hero />
      </div>
      <ScrollableCardStackDemo />
      <div className="flex justify-center -mb-20">
        <AccordionDemo />
      </div>
      <div className="flex justify-center mt-10 md:mt-24">
        <SystemDesign />
      </div>
      <CTA />
      <Footer />
      <ChatBotOpenButton />
    </div>
  );
}
