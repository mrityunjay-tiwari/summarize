"use client";

import {useState} from "react";
import {Badge} from "@/components/reui/badge";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";
import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconLock,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import { MdOutlineCancel } from "react-icons/md";

const steps = [
  {
    title: "User Details",
    icon: <IconUserSquareRounded className="size-4" />,
  },
  {
    title: "Payment Info",
    icon: <IconCreditCard className="size-4" />,
  },
  {
    title: "Auth OTP",
    icon: <IconLock className="size-4" />,
  },
];

export type StepperStep = {
  title: string;
  icon: React.ReactNode;
  content: string;
};

export function UploadStepper({
  steps,
  currentStep,
  onCancel,
}: {
  steps: StepperStep[];
  currentStep: number;
  onCancel?: () => void;
}) {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <Stepper
        value={currentStep}
        onValueChange={() => {}} // Disabled manual changing
        indicators={{
          completed: <IconCheck className="size-3.5" />,
          loading: <IconLoader2 className="size-3.5 animate-spin" />,
        }}
        className="w-full max-w-4xl space-y-8"
      >
        <StepperNav className="gap-3 flex-row overflow-x-auto thin-scrollbar pb-2">
          {steps.map((step, index) => (
            <StepperItem
              key={index}
              step={index + 1}
              className="relative flex-1 items-start shrink-0 min-w-[120px]"
            >
              <StepperTrigger
                className="flex grow flex-col items-start justify-center gap-2.5 pointer-events-none"
                asChild
              >
                <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                  {step.icon}
                </StepperIndicator>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                    Step {index + 1}
                  </div>
                  <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold whitespace-nowrap">
                    {step.title}
                  </StepperTitle>
                  <div>
                    <Badge
                      size="sm"
                      variant="primary-light"
                      className="hidden group-data-[state=active]/step:inline-flex"
                    >
                      In Progress
                    </Badge>
                    <Badge
                      variant="success-light"
                      size="sm"
                      className="hidden group-data-[state=completed]/step:inline-flex"
                    >
                      Completed
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                    >
                      Pending
                    </Badge>
                  </div>
                </div>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 w-[calc(100%-2rem)] flex-none" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="text-sm">
          {steps.map((step, index) => (
            <StepperContent
              key={index}
              value={index + 1}
              className="flex items-center justify-center p-8"
            >
              <div className="flex items-center gap-3">
                <IconLoader2 className="size-6 animate-spin text-primary" />
                <span className="font-semibold text-muted-foreground text-lg">
                  {step.content}
                </span>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
      <div>
            <Button
              size={"lg"}
              variant={"outline"}
              className="rounded-full w-full shadow-md"
              onClick={onCancel}
              disabled={!onCancel}
            >
              <MdOutlineCancel /> Cancel
            </Button>
          </div>
    </div>
  );
}
