import { MotionDiv } from "@/components/common/motion-wrapper";
import IndividualSummaryViewer from "@/components/summaries/ind-summary-viewer";
import { DEMO_CONTENT } from "@/utils/demo-card";

export default function Sample() {
    return(
        <div className="flex justify-center items-center">
            <MotionDiv initial={{y:30, opacity:0}} whileInView={{y: 0,opacity: 1}} transition={{ duration: 2, ease: "easeOut" }}>
                <IndividualSummaryViewer summary={DEMO_CONTENT} />
            </MotionDiv>
        </div>
    )
}