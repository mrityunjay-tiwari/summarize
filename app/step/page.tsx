
import FeatureCounter from "@/components/individual-project/counter";
import {UploadStepper, StepperStep} from "@/components/upload/stepper";
import {
  IconUpload,
  IconFileText,
  IconBoxModel2,
  IconDatabase,
} from "@tabler/icons-react";

export default function UploadIngStepper() {
  const stepsForChat: StepperStep[] = [
    {
      title: "Uploading File",
      icon: <IconUpload className="size-4" />,
      content: "Uploading your PDF file securely...",
    },
    {
      title: "Extracting Text",
      icon: <IconFileText className="size-4" />,
      content: "Extracting and analyzing text structure...",
    },
    {
      title: "Vectorizing",
      icon: <IconBoxModel2 className="size-4" />,
      content: "Generating vector embeddings for context...",
    },
    {
      title: "Saving Project",
      icon: <IconDatabase className="size-4" />,
      content: "Saving document to the knowledge base...",
    },
  ];

  return (
    <div className="p-8 flex justify-center">
      <UploadStepper steps={stepsForChat} currentStep={2} />
      <div className="flex min-h-[300px] items-center justify-center rounded-xl p-8">
        <FeatureCounter />
      </div>
    </div>
  );    
}
