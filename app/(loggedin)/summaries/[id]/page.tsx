import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import EmptySummaryState from "@/components/summaries/empty-summary";
import IndSourceInfo from "@/components/summaries/ind-source-info";
import IndSummaryHeader from "@/components/summaries/ind-summary-header";
import IndividualSummaryViewer from "@/components/summaries/ind-summary-viewer";
import getSummaries, { getIndividualSummary } from "@/lib/summaries";
import { auth } from "@clerk/nextjs/server";
import { FileText } from "lucide-react";
import { redirect } from "next/navigation";

interface SummaryPageProps {
  params: Promise<{ id: string }>;
}

async function getInfo({ params }: SummaryPageProps) {
  const summaryId = (await params).id;

  const user = await auth();
  const userId = user.userId;
  if (!userId) {
    console.log("userId from clerk not found to server summaries");
    return redirect("/sign-in");
  }

  console.log(`userId from summaries/[id]/page.tsx ${userId}`);
  const summaries = await getSummaries(userId);
  console.log(`summaries is -`);
  console.log({ summaries });
  console.log(summaries[0].id);

  const idOfSUmmary = await getIndividualSummary({ userId, summaryId });

  console.log(idOfSUmmary?.id, idOfSUmmary?.title);

  return { summaries, user, summaryId, idOfSUmmary };
}
export default async function SummaryPage({ params }: SummaryPageProps) {
  // const summaryId = (await params).id

  // const user = await auth();
  // const userId = user.userId
  // if(!userId) {
  //     console.log("userId from clerk not found to server summaries")
  //     return redirect('/sign-in')
  // }

  // console.log(`userId from summaries/[id]/page.tsx ${userId}`);
  // const summaries = await getSummaries(userId)
  // console.log(`summaries is -`);
  // console.log({summaries});
  // console.log(summaries[0].id);

  // const idOfSUmmary = await getIndividualSummary({userId, summaryId})

  // console.log(idOfSUmmary?.id);

  const info = await getInfo({ params });
  const idOfSUmmary = info.idOfSUmmary;

  return (
    <main>
      {/* Summary Page - {summaryId} 
            <br />
            Summary id - {summaries[0].id}
            <br />
            Summary id from function - {idOfSUmmary?.id} */}
      <div>
        {idOfSUmmary?.id ? (
          <IndividualSummaryPage params={params} />
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <EmptySummaryState
              text="No Summary"
              description="No summary exists for the id you have entered."
              linkText="Create summary"
            />{" "}
          </div>
        )}
      </div>
    </main>
  );
}

const IndividualSummaryPage = async ({ params }: SummaryPageProps) => {
  const info = await getInfo({ params });
  const word_count = info.idOfSUmmary?.summary_text.length;
  const readingTime = Math.ceil(Number(word_count || 0) / 200);
  console.log(
    `info.idOfSUmmary?.summary_text - ${info.idOfSUmmary?.summary_text}`
  );

  if (!info.idOfSUmmary?.title) {
    return;
  }
  return (
    <div className="relative isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white w-screen">
      <BgGradient className="from-rose-400 via-rose-200 to-orange-200" />
      <div className="flex flex-col gap-4 w-full">
        <div className="px-12 sm:px-20 lg:px-28 py-6 sm:py-12 lg:py-24 justify-center flex flex-col w-full">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <IndSummaryHeader
              title={info.idOfSUmmary?.title}
              createdAt={info.idOfSUmmary?.created_at}
              readingTime={readingTime}
            />
          </MotionDiv>

          {info.idOfSUmmary?.file_name && (
            <IndSourceInfo
              fileName={info.idOfSUmmary.file_name}
              title={info.idOfSUmmary.title}
              created_at={info.idOfSUmmary.created_at}
              original_file_url={info.idOfSUmmary.original_file_url}
              summary_text={info.idOfSUmmary.summary_text}
            />
          )}

          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mt-4 sm:mt-8 lg:mt-16 w-full"
          >
            <div
              className="relative p-4 sm:p-6 lg:p-8 
                        bg-white/80 backdrop-blur-md rounded-2xl 
                        sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl 
                        hover:bg-white/90 max-w-4xl mx-auto"
            >
              <div
                className="absolute inset-0 
                            bg-linear-to-br from-rose-50/5 via-orange-50/30 to-transparent opacity-50 rounded-2xl 
                            sm:rounded-3xl"
              />

              <div
                className="absolute top-2 sm:top-4 
                            right-2 sm:right-4 flex items-center gap-1.5 
                            sm:gap-2 text-xs sm:text-sm 
                            text-muted-foreground bg-white/90 px-3 sm:px-3.5 
                            py-1 sm:py-1.5 rounded-full shadow-xs"
              >
                <FileText
                  className="h-3 w-3 sm:h-4 sm:w-4 
                            text-rose-400"
                />
                {word_count?.toLocaleString()} words
              </div>
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mt-8 sm:mt-16 flex justify-center"
              >
                <IndividualSummaryViewer
                  summary={info.idOfSUmmary?.summary_text}
                />
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};
