"use client";

import CanvasDemo from "../ai/canvas";
import { FlashCardsCarousel } from "../individual-project/flash_cards-tab/flash_cards_carousel";
import { QuizCarousel } from "../individual-project/quiz-tab/quiz-carousel";
import ScrollableCardStack from "../smoothui/scrollable-card-stack";
import React from "react";
import Headings from "./headings";
import ChatDemo from "./chatdemo";

export type TCardDataProps = {
    id: number; 
    content: React.ReactNode;
    caption?: string;
}
const MOCK_LLM_QUIZZES = Array.from({ length: 5 }).map((_, i) => ({
  question: `This is a sample question ${i + 1} that will be part of the quiz?`,
  options: [
    { optionIndex: 1, option: `First choice for question ${i + 1}` },
    { optionIndex: 2, option: `Second choice for question ${i + 1}` },
    { optionIndex: 3, option: `Third choice for question ${i + 1}` },
    { optionIndex: 4, option: `Fourth choice for question ${i + 1}` },
  ],
  explanation: `This is the explanation for question ${i + 1}. It provides more details to help you understand the concept better.`,
  correctOption: i % 2 === 0 ? 1 : 2
}));

const MOCK_LLM_FLASHCARDS = Array.from({ length: 10 }).map((_, i) => ({
    question: "React Fundamentals",
    answer:"A component is a reusable piece of UI that can optionally accept inputs (props) and return React elements."
}));

export default function ScrollableCardStackDemo() {
 
  const cardData: TCardDataProps[] = [
    {
      id: 1,
      content: <div className="flex w-full h-full items-center justify-center px-1.5"><QuizCarousel quizzes={MOCK_LLM_QUIZZES} /></div>,
      caption: "Play quiz here only !!",
    },
    {
      id: 2,
      content: <div className="mt-10"><FlashCardsCarousel flashCards={MOCK_LLM_FLASHCARDS} /></div>,
      caption: "scroll your flash cards !!",
    },
    {
      id: 3,
      content: <CanvasDemo />,
      caption: "Edit or download your AI generated mindmap !!",
    },
    {
      id: 4,
      content: <ChatDemo />,
      caption: "Chat with your document !!",
    },
  ];

  return (
    <div className="max-w-full">
      <div className="flex flex-col items-center mb-5">
        <Headings title="Example Output" subtitle="Features" subheading="Interactive Playground" />
        <h1 className="text-xs">(Scroll over cards to navigate through features.)</h1>
      </div>
      <ScrollableCardStack
        cardHeight={600}
        className="mx-auto"
        items={cardData}
        perspective={1200}
        transitionDuration={200}
      />
    </div>
  );
}
