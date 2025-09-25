import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, User, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import { ContainerVariants, itemVariant } from "@/utils/constants";

interface Plans {
  id: string;
  name: string;
  price: number;
  description: string;
  items: string[];
  paymentlink: string;
  priceId: string;
  icon: React.ReactNode;
}
const plans: Plans[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "For individuals",
    items: [
      "5 PDF summaries per week",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
    ],
    paymentlink: "",
    priceId: "",
    icon: <User size={32} />,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professional and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
    ],
    paymentlink: "",
    priceId: "",
    icon: <Users size={32} />,
  },
];

const PricingCard = ({
  id,
  name,
  price,
  description,
  items,
  paymentlink,
  priceId,
  icon,
}: Plans) => {
  return (
    <MotionDiv initial={{opacity: 0, x:-40}} whileInView={{opacity: 1, x:0}} transition={{duration: 0.5, ease: 'easeOut'}}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-200"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
          id === "pro" && "border-rose-500 gap-5 border-2"
        )}
      >
        <MotionDiv
          initial={{opacity: 0, x:-40}} whileInView={{opacity: 1, x:0}} transition={{duration: 0.5, ease: 'easeOut'}}
          className="flex justify-left items-center gap-4"
        >
          <div>
            <p>{icon}</p>
          </div>
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </MotionDiv>
        <MotionDiv
          initial={{opacity: 0, x:-40}} whileInView={{opacity: 1, x:0}} transition={{duration: 0.5, ease: 'easeOut'}}
          className="flex gap-2"
        >
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">USD</p>
            <p className="text-xs">/month</p>
          </div>
        </MotionDiv>
        <MotionDiv
          initial={{opacity: 0, x:-40}} whileInView={{opacity: 1, x:0}} transition={{duration: 0.5, ease: 'easeOut'}}
          className="space-y-2.5 leading-relaxed text-base flex-1"
        >
          {items.map((item, key) => (
            <li key={key} className="flex items-center gap-2">
              <CheckIcon size={18} /> {item}
            </li>
          ))}
        </MotionDiv>
        <MotionDiv
          initial={{opacity: 0, x:-40}} whileInView={{opacity: 1, x:0}} transition={{duration: 0.5, ease: 'easeOut'}}
          className="space-y-2 flex justify-center w-full text-white"
        >
          <Link
            href={"/paymentLink"}
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 transform transition duration-1000 ease-in-out text-border-2 py-2",
              id === "pro"
                ? "border-rose-900"
                : "border-rose-100 from-rose-400 to-rose-500"
            )}
          >
            Buy Now <ArrowRight size={18} />{" "}
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
export default function PricingSection() {
  return (
    <MotionSection
      variants={ContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv
          variants={itemVariant}
          className="flex items-center justify-center w-full pb-12"
        >
          <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">
            Pricing
          </h2>
        </MotionDiv>
        <div
          className="relative flex justify-center flex-col 
                lg:flex-row items-center lg:items-stretch gap-8"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
