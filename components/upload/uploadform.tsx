"use client";

import {useUploadThing} from "@/utils/uploadthing";
import {
  UploadFormInputPDF,
  UploadFormInputWebsite,
  UploadFormInputYouTube,
  UploadFormWorkingOn,
} from "./uploadforminput";
import {uuid, z} from "zod";
import {toast} from "sonner";
import {generateSummary, generateYouTubeSummary, storeSummary} from "@/actions/upload-actions";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import CheckIfUserExists from "@/lib/checkUser";
import userSummariesLength from "@/utils/summaries-length-for-user";
import LimitCountBar from "../summaries/limit-count-bar";
import {MotionDiv} from "../common/motion-wrapper";
import LoadingSkeleton from "./upload-skeleton";
import {SelectDemo} from "./selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { youTubeTranscript } from "@/actions/youtubeTranscript-actions";

const schema = z.object({
  file: z
    .instanceof(File, {message: "Invalid File type"})
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
  const {startUpload, routeConfig} = useUploadThing("pdfUploader", {
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

  const handlesubmitPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("submitted");
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // validating the fields
      const validatedFiles = schema.safeParse({file});

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
      console.log({summary});

      const {data = null, message = null} = summary || {};

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

  const handlesubmitVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("video link submitted");

      // extract video content
      const formData = new FormData(e.currentTarget);
      const link = formData.get("youtubeLink") as string;

      const {pageContent, title} = await youTubeTranscript({link});

      console.log(link);
      
      console.log(pageContent);

      const youTubeVideoSummary = await generateYouTubeSummary(pageContent)
      
      console.log(`youTubeVideoSummary is the following : ${youTubeVideoSummary}`)

      const {data = null, message = null} = youTubeVideoSummary || {};

      if (data) {
        console.log("data is : ");
        console.log(data);

        let storeResult: any;
        toast("Saving PDF", {
          description: "Please wait while we are saving your summary",
        });

        if (data.summary) {
          const getuserIdFromClerk = await CheckIfUserExists();

          storeResult = await storeSummary({
            user_id: getuserIdFromClerk,
            file_name: title,
            title: title,
            summary_text: data.summary,
            original_file_urll: link,
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

    } catch (error) {
      setLoading(false);
      console.error("an error occured", error);
      toast("Something went wrong", {
        description: "Unable to summarize the video. Please try again.",
      });
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handlesubmitWebsite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("video link submitted");

      // extract video content
      const formData = new FormData(e.currentTarget);
      const link = formData.get("youtubeLink") as string;

      const {pageContent, title} = await youTubeTranscript({link});

      console.log(link);
      
      console.log(pageContent);

      const youTubeVideoSummary = await generateYouTubeSummary(pageContent)
      
      console.log(`youTubeVideoSummary is the following : ${youTubeVideoSummary}`)

      const {data = null, message = null} = youTubeVideoSummary || {};

      if (data) {
        console.log("data is : ");
        console.log(data);

        let storeResult: any;
        toast("Saving PDF", {
          description: "Please wait while we are saving your summary",
        });

        if (data.summary) {
          const getuserIdFromClerk = await CheckIfUserExists();

          storeResult = await storeSummary({
            user_id: getuserIdFromClerk,
            file_name: title,
            title: title,
            summary_text: data.summary,
            original_file_urll: link,
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

    } catch (error) {
      setLoading(false);
      console.error("an error occured", error);
      toast("Something went wrong", {
        description: "Unable to summarize the video. Please try again.",
      });
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };


  const [selectedType, setSelectedType] = useState("");

  return (
    <MotionDiv
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, ease: "easeOut"}}
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto my-2 text-center"
    >
      {/* To select the content type - PDF / YouTube Video / Website */}

      <div>
        <Select onValueChange={(value) => setSelectedType(value)}>
          <SelectTrigger className="w-1/3 justify-self-center">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Content Type</SelectLabel>
              <SelectItem value="pdf">Upload PDF</SelectItem>
              <SelectItem value="youtube">YouTube Link</SelectItem>
              <SelectItem value="website">Website Link</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Input Box on the basis of type of content */}

      {summariesCount < 5 ? (
        selectedType === "pdf" ? (
          <UploadFormInputPDF
            isLoading={loading}
            ref={formRef}
            onsubmit={handlesubmitPDF}
          />
        ) : selectedType === "youtube" ? (
          <UploadFormInputYouTube
            isLoading={loading}
            ref={formRef}
            onsubmit={handlesubmitVideo}
          />
        ) : selectedType === "website" ? (
          <UploadFormWorkingOn />
        ) : (
          <UploadFormInputPDF
            isLoading={loading}
            ref={formRef}
            onsubmit={handlesubmitPDF}
          />
        )
      ) : (
        <LimitCountBar />
      )}
    </MotionDiv>
  );
}
