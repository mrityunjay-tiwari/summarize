"use client";

import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./uploadforminput";
import { uuid, z } from "zod";
import { toast } from "sonner";
import { generateSummary, storeSummary } from "@/actions/upload-actions";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CheckIfUserExists from "@/lib/checkUser";
import userSummariesLength from "@/utils/summaries-length-for-user";
import LimitCountBar from "../summaries/limit-count-bar";
import { MotionDiv } from "../common/motion-wrapper";
import LoadingSkeleton from "./upload-skeleton";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File type" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be of type pdf",
    }),
});

export default function UploadForm() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [summariesCount, setSummariesCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await userSummariesLength();
        setSummariesCount(count);
      } catch (error) {
        console.error("error fetching summaries count", error);
      }
    };

    fetchCount();
  }, []);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  // uploadthing parameters defined about what to do on upload begin and on uploadComplete or uploaderror
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (fll) => {
      console.log("uploaded successfully!");
      fll.forEach((fl) => {
        console.log("URL is :", fl.ufsUrl);
        console.log("name is :", fl.name);
      });
    },
    onUploadError: (er) => {
      console.error("error occurred while uploading", er);
      toast("error occured while uploading", {
        description:
          "Due to some error you were unable to upload the file, please try again",
      });
    },
    onUploadBegin: (fileNameee) => {
      // so there is no specific name required for this
      console.log("upload has begun for", fileNameee);
    },
  });

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("submitted");
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // validating the fields
      const validatedFiles = schema.safeParse({ file });

      if (!validatedFiles.success) {
        console.log(
          validatedFiles.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
        );
        toast("something went wrong", {
          description:
            "the files could not be validated according to defined parameters",
        });
        setLoading(false);
        return;
      }

      console.log(validatedFiles);

      toast("Uploading PDF..", {
        description: "Please wait, we are uploading your PDF",
      });

      // upload the files to uploadthings
      const resp = await startUpload([file]);
      if (!resp) {
        console.log("Error in file uploading");
        toast("Something went wrong", {
          description: "Please use a different file",
          duration: 2000,
        });
        setLoading(false);
        return;
      }

      toast("Processing PDF..", {
        description: "Our AI is reading through your document !",
      });

      // parse the pdf using langchain
      console.log("resp is : ", resp);

      const summary = await generateSummary(resp);
      console.log({ summary });

      const { data = null, message = null } = summary || {};

      if (data) {
        console.log("data is : ");
        console.log(data);

        let storeResult: any;
        toast("Saving PDF", {
          description: "Please wait while we are saving your summary",
        });

        if (data.summary) {
          console.log("data.summary is processing");
          console.log(
            "following content to be sent as params in storeSummary : "
          );
          console.log(
            `resp[0].name : ${resp[0].name}, data.title : ${data.title}, data.summary : ${data.summary}, resp[0].ufsUrl : ${resp[0].ufsUrl}`
          );
          console.log(data.summary);

          const getuserIdFromClerk = await CheckIfUserExists();
          console.log(`getuserIdFromClerk : ${getuserIdFromClerk}`);

          storeResult = await storeSummary({
            user_id: getuserIdFromClerk,
            file_name: resp[0].name,
            title: data.title,
            summary_text: data.summary,
            original_file_urll: resp[0].ufsUrl,
          });

          toast("Summary generated", {
            description: "your pdf has been successfully sumarized and saved !",
          });

          console.log(
            `storeResult.data.id from uploadform.tsx : ${storeResult.data.id}`
          );

          router.push(`/summaries/${storeResult.data.id}`);
          formRef.current?.reset();
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("an error occured", error);
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-8 w-full max-w-2xl mx-auto my-5"
    >
      {summariesCount < 5 ? (
        <UploadFormInput
          isLoading={loading}
          ref={formRef}
          onsubmit={handlesubmit}
        />
      ) : (
        <LimitCountBar />
      )}
    </MotionDiv>
  );
}

// (
//         <>
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-background px-3 text-muted-foreground text-sm">Processing</span>
//             </div>
//           </div>

//         </>
//       )
