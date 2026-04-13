import CheckIfUserExists from "@/actions/checkUser";
import { getSummaries } from "@/actions/summary-actions";
import { getUserDocuments } from "@/actions/document-actions";
import { DocumentGrid } from "@/components/dashboard/document-grid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BGGrid2 from "@/components/ui/bg-pattern2";
import BGGrid3 from "@/components/ui/bg-pattern3";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const userId = await CheckIfUserExists();
  
  if (!userId) {
    console.log("userId from auth not found to server summaries");
    return redirect("/sign-in");
  }

  // Fetch both the old summaries and your new robust PDF Documents!
  const summaries = await getSummaries(userId);
  const documents = await getUserDocuments(userId);

  return (
    <main className="min-h-screen">
      <BGGrid3 />
      <div className="container mx-auto flex flex-col gap-4 w-4/5">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-1.5 justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Your Projects
              </h1>
              <p className="text-gray-600">
                Transform your PDFs into interactive chat, quizzes, and flashcards.
              </p>
            </div>
            
            <div>
              <Button className="bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 group">
                <Link href={"/upload"} className="flex items-center">
                  <PlusIcon className="w-5 h-5 mr-2" /> Upload PDF
                </Link>
              </Button>
            </div>
          </div>
          <Separator className="mb-5" />
          {/* New Robust Prisma Document Grid */}
          <DocumentGrid initialDocuments={documents} />
          
        </div>
      </div>
    </main>
  );
}