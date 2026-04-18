import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
} from "@tabler/icons-react";

import {QuizTab} from "./quiz-tab/quiz-tab";
import {MindMapTab} from "./mindmap-tab";
import {FlashCardsTab} from "./flash_cards-tab/flash_cards-tab";
import {ChatTab} from "./chat-tab/chat-tab";
import {IoChatbubbleOutline} from "react-icons/io5";
import {TbCards} from "react-icons/tb";
import {SiQuizlet} from "react-icons/si";
import {FcMindMap} from "react-icons/fc";
import {SiLivechat} from "react-icons/si";
import {HiOutlineChatBubbleBottomCenter} from "react-icons/hi2";
import {PiCardsThreeBold} from "react-icons/pi";

export function SelectTheTab() {
  return (
    <div className="flex w-full h-full flex-col gap-4">
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <TabsList className="w-full shrink-0 rounded-sm">
          <TabsTrigger value="chat" className="rounded">
            <SiLivechat className="size-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="flash-cards" className="rounded">
            <PiCardsThreeBold className="size-4" />
            Flash Cards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="rounded">
            <SiQuizlet className="size-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="mind-map" className="rounded">
            <FcMindMap className="size-4 grayscale" />
            Mind Map
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="chat"
          className="flex-1 mt-0 border-0 p-0 overflow-hidden"
        >
          <ChatTab />
        </TabsContent>
        <TabsContent
          value="flash-cards"
          className="flex-1 mt-0 border-0 p-0 overflow-hidden"
        >
          <FlashCardsTab />
        </TabsContent>
        <TabsContent
          value="quiz"
          className="flex-1 mt-0 border-0 p-0 overflow-hidden"
        >
          <QuizTab />
        </TabsContent>
        <TabsContent
          value="mind-map"
          className="flex-1 mt-0 border-0 p-0 overflow-hidden"
        >
          <MindMapTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
