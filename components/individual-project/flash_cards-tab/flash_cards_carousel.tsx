"use client"

import { useCallback, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import CardFlip from "./flip-card"

const FLASH_CARDS = [
  {
    title: "React Fundamentals",
    subtitle: "What is a React component?",
    description: "A component is a reusable piece of UI that can optionally accept inputs (props) and return React elements.",
    features: ["Reusable", "Composable", "Stateful or Stateless"],
  },
  {
    title: "Tailwind CSS",
    subtitle: "What is utility-first CSS?",
    description: "An approach where you apply low-level utility classes directly in your HTML to build custom designs easily.",
    features: ["Faster development", "Smaller CSS bundles"],
  },
  {
    title: "Next.js App Router",
    subtitle: "What are Server Components?",
    description: "They allow you to render components on the server, reducing the JavaScript sent to the client.",
    features: ["Zero bundle size", "Direct backend access"],
  },
  {
    title: "TypeScript",
    subtitle: "Why use TypeScript?",
    description: "TypeScript adds static typing to JavaScript, helping catch errors early during development.",
    features: ["Type safety", "Better DX", "Easier refactoring"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  },
  {
    title: "Vercel",
    subtitle: "Edge Network caching",
    description: "Vercel edge network caches your application globally, serving it from regions closest to your users.",
    features: ["Global CDN", "Edge Functions", "Automatic SSL"],
  }
];

export function FlashCardsCarousel() {
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return
      mainApi.scrollTo(index)
    },
    [mainApi, thumbApi]
  )

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return
    const index = mainApi.selectedScrollSnap()
    setSelectedIndex(index)
    thumbApi.scrollTo(index)
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!mainApi) return
    onSelect()
    mainApi.on("select", onSelect)
    mainApi.on("reInit", onSelect)
    return () => {
      mainApi.off("select", onSelect)
      mainApi.off("reInit", onSelect)
    }
  }, [mainApi, onSelect])

  return (
    <div className="flex w-full max-w-lg flex-col gap-0 p-4">
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {FLASH_CARDS.map((card, index) => (
            <CarouselItem key={index}>
              <div className="flex h-[400px] items-center justify-center rounded-md p-6">
                <CardFlip 
                  title={card.title} 
                  subtitle={card.subtitle} 
                  description={card.description} 
                  features={card.features} 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        setApi={setThumbApi}
        opts={{
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 flex-row">
          {FLASH_CARDS.map((card, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 cursor-pointer pl-2 sm:basis-1/4 md:basis-1/5"
              onClick={() => onThumbClick(index)}
            >
              <div
                className={cn(
                  "rounded-2xl relative flex aspect-square flex-col items-center justify-center overflow-hidden border-2 p-2 text-center transition-all",
                  index === selectedIndex
                    ? "border-primary bg-primary/5 opacity-100 shadow-sm"
                    : "border-transparent bg-muted/50 opacity-50 hover:bg-muted hover:opacity-100"
                )}
              >
                <span className="line-clamp-2 text-xs font-semibold text-foreground">
                  {card.title}
                </span>
                <span className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                  {card.subtitle}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
