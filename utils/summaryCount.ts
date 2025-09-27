import getSummaries from "@/lib/summaries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function summariesCount() {
    const user = await auth();
    const userId = user.userId;
    if (!userId) {
    console.log("userId from clerk not found to server summaries");
    return redirect("/sign-in");
    }
    console.log(`userId from dashboard/page.tsx ${userId}`);

    const summaries = await getSummaries(userId);

    const isLoggoedin = false;
}