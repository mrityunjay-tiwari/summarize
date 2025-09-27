import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Page from "@/app/sign-in/[[...sign-in]]/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import getSummaries from "@/lib/summaries";

export default async function Header() {
  const user = await auth();
  const userId = user.userId;
  if (!userId) {
    console.log("userId from clerk not found to server summaries");
    return redirect("/sign-in");
  }
  console.log(`userId from dashboard/page.tsx ${userId}`);

  const summaries = await getSummaries(userId);

  const isLoggoedin = false;
  return (
    <nav className="container flex items-center justify-between lg:px-10 px-2 py-4 mx-auto">
      <div className="flex">
        <NavLink href={"/"} className="gap-1 lg:gap-2 flex items-center ">
          <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 hover:rotate-12 hover:cursor-pointer transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">
            SummariZE
          </span>
        </NavLink>
      </div>
      <div>
        <SignedOut>
          <NavLink href={"/#pricing"}>Pricing</NavLink>
        </SignedOut>
        <SignedIn>
          <NavLink href={"/dashboard"}>Your SUmmaries</NavLink>
        </SignedIn>
      </div>
      <SignedIn>
        <div className="flex items-center gap-4">
          {summaries.length <= 5 && (
            <NavLink href={"/upload"}>Upload a PDF</NavLink>
          )}
          <div className="gap-1 flex items-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <div className="text-rose-800">Pro</div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <NavLink href={"/sign-in"}>SignIn</NavLink>
      </SignedOut>
    </nav>
  );
}
