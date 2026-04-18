"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel"
import Quiz, { Question } from "./quiz"
import { Separator } from "@/components/ui/separator"
import AppleActivityCard, { ActivityData } from "./quiz-result"
import { VscDebugRestart } from "react-icons/vsc"

const MOCK_QUESTIONS: Question[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `q-${i + 1}`,
  number: i + 1,
  question: `This is a sample question ${i + 1} that will be part of the quiz?`,
  options: [
    { id: `opt-1`, label: `Option A`, description: `First choice for question ${i + 1}` },
    { id: `opt-2`, label: `Option B`, description: `Second choice for question ${i + 1}` },
    { id: `opt-3`, label: `Option C`, description: `Third choice for question ${i + 1}` },
    { id: `opt-4`, label: `Option D`, description: `Fourth choice for question ${i + 1}` },
  ],
  explanation: `This is the explanation for question ${i + 1}. It provides more details to help you understand the concept better.`,
  correctOptionId: i % 2 === 0 ? "opt-1" : "opt-2"
}));

export function QuizCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  
  const [attempts, setAttempts] = React.useState<Record<string, boolean>>({})
  const [showResult, setShowResult] = React.useState(false)
  const [resetKey, setResetKey] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleRestart = React.useCallback(() => {
    setAttempts({});
    setShowResult(false);
    api?.scrollTo(0);
    setResetKey(prev => prev + 1);
  }, [api]);

  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect = Object.values(attempts).filter(Boolean).length;
  const totalQuestions = MOCK_QUESTIONS.length;

  const activities: ActivityData[] = [
    {
      label: "YourScore",
      value: totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100),
      color: "#63cc3d",
      size: 200,
      current: totalCorrect,
      target: totalQuestions,
      unit: "",
    },
    {
      label: "TotalAttempt",
      value: totalQuestions === 0 ? 0 : Math.round((totalAttempted / totalQuestions) * 100),
      color: "#A3F900",
      size: 160,
      current: totalAttempted,
      target: totalQuestions,
      unit: "",
    },
    {
      label: "Accuracy",
      value: totalAttempted === 0 ? 0 : Math.round((totalCorrect / totalAttempted) * 100),
      color: "#04C7DD",
      size: 120,
      current: totalCorrect,
      target: totalAttempted,
      unit: "",
    },
  ];

  if (showResult) {
    return (
      <div className="w-full max-w-4xl mx-auto border rounded-xl bg-background shadow-xs overflow-hidden mt-10">
        <div className="bg-muted px-5 py-2 flex justify-between items-center">
          <h1 className="text-lg font-medium">Result</h1>
          <button 
            onClick={handleRestart} 
            className="text-xs flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <VscDebugRestart />Restart Quiz
          </button>
        </div>
        <div className="p-5 flex justify-center">
          <AppleActivityCard activities={activities} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-xl bg-background shadow-xs overflow-hidden mt-10">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {MOCK_QUESTIONS.map((q) => (
            <CarouselItem key={q.id}>
              {/* the Quiz component has styling that looks like the card content */}
              <Quiz 
                key={`${resetKey}-${q.id}`}
                question={q} 
                onAttempt={(isCorrect) => setAttempts(prev => ({ ...prev, [q.id]: isCorrect }))}
                onRestart={handleRestart}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Footer Navigation */}
      <Separator />
      <div className="flex items-center justify-between px-6 py-4 bg-background">
        <div className="text-sm font-medium text-foreground">
          {current}/{count}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
            className="text-sm font-semibold text-foreground hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
             &lt; Previous
          </button>
          <button
            onClick={() => {
              if (current === count) {
                setShowResult(true);
              } else {
                api?.scrollNext();
              }
            }}
            className="text-sm font-semibold text-foreground hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {current === count ? "Submit >" : "Next >"}
          </button>
        </div>
      </div>
    </div>
  )
}

