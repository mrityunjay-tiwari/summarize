"use client";

import {useUploadThing} from "@/utils/uploadthing";
import {
  UploadFormInputPDF,
  UploadFormInputYouTube,
  UploadFormWorkingOn,
} from "./uploadforminput";
import {z} from "zod";  
import {toast} from "sonner";
import {FormEvent, useEffect, useRef, useState} from "react";
import userSummariesLength from "@/utils/summaries-length-for-user";
import LimitCountBar from "../summaries/limit-count-bar";
import {MotionDiv} from "../common/motion-wrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const {startUpload} = useUploadThing("pdfUploader", {
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
    onUploadError: (er) => {
      console.error("error occurred while uploading", er);
      toast("error occured while uploading", {
        description:
          "Due to some error you were unable to upload the file, please try again",
      });
    },
    onClientUploadComplete: (file) => {
      console.log("uploaded successfully!");
      file.forEach((fl) => {
        console.log('fl info : ', fl);
      });
    }
  });

  const handlPDF = async(e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFiles = schema.safeParse({file});

      if(!validatedFiles.success) {
        toast("something went wrong");
        setLoading(false);
        return;
      }

      toast("we are working on uploading your file");

      const uploadFile = await startUpload([file])
      if(!uploadFile) {
        toast("something during file upload went wrong")
        setLoading(false);
        return;
      }

      toast("file uploaded successfully")
      setLoading(false);
      formRef.current?.reset();
    } catch {
      setLoading(false);
      console.error("something went wrong while uploading the file to uploadThings")
    } finally {
      setLoading(false);
    }
  }
  const [selectedType, setSelectedType] = useState("");

  return (
    <MotionDiv
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, ease: "easeOut"}}
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto my-2 text-center"
    >
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

      {summariesCount < 5 ? (
        selectedType === "pdf" ? (
          <UploadFormInputPDF
            isLoading={loading}
            ref={formRef}
            onsubmit={handlPDF}
          />
        ) : selectedType === "youtube" ? (
          <UploadFormInputYouTube
            isLoading={loading}
            ref={formRef}
            onsubmit={() => {console.log("to be done")}}
          />
        ) : selectedType === "website" ? (
          <UploadFormWorkingOn />
        ) : (
          <UploadFormInputPDF
            isLoading={loading}
            ref={formRef}
            onsubmit={handlPDF}
          />
        )
      ) : (
        <LimitCountBar />
      )}
    </MotionDiv>
  );
}