'use client'

import { JSX, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { NavigationControls } from "./navigation-controls";
import ProgressBar from "./progress-bar";

const parseSection = (section: string) : {title: string, content: string[]} => {
    const [ title, ...content ] = section.split('\n')

    const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim()

    const points: String[] = []
    const currentPoint = ''
    content.forEach((line) => {
        const trimmedLine = line.trim()
    })
    return { title, content}
}
export default function IndividualSummaryViewer ({summary} : {summary : string | undefined}) {

    const [currentSection, setCurrentSection] = useState(0)

    const sections = summary?.split('\n#').map((section) => (section.trim())).filter(Boolean).map(parseSection)
    if(!sections) {
        return
    }
    const handleNext = () => setCurrentSection((prev) => (Math.min(prev + 1, sections?.length - 1)))
    const handlePrevious = () => setCurrentSection((prev) => (Math.max(prev - 1, 0)))

    const handleSectionSelect = (index: number) => setCurrentSection(Math.min(Math.max(index, 0), sections.length - 1))
    const contentLength = sections[currentSection].content.map((sec) => (sec)).length
    console.log(sections[currentSection].content.map((sec) => (sec)).length);
    
    return (
        <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[550px] w-full xl:w-[600px] overflow-hidden bg-linear-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
            <div><ProgressBar key={sections[currentSection].title} sections={sections} currentSection={currentSection} /></div>
            <CardHeader className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10 justify-center items-center">
                <CardTitle className="text-xl lg:text-2xl font-bold text-center flex items-center justify-center gap-2">{sections[currentSection].title.startsWith('#') ? sections[currentSection].title.slice(1).trim() : sections[currentSection].title}</CardTitle>
            </CardHeader>
            <CardContent>{(() => {
                const items: JSX.Element[] = [];
                sections[currentSection].content.forEach((sec, i) => {
                    items.push(<div className="text-gray-900" key={i}>{sec}</div>);
                });
                return items;
            })()}
                <NavigationControls currentSection={currentSection} totalSections={sections.length} onPrevious={handlePrevious} onNext={handleNext} onSectionSelect={setCurrentSection} />
            </CardContent>
        </Card>
    )
}