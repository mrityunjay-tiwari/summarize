"use client";

import {useUploadThing} from "@/utils/uploadthing";
import {UploadFormInputPDF} from "./uploadforminput";
import {toast} from "sonner";
import {FormEvent, useEffect, useRef, useState} from "react";
import userSummariesLength from "@/utils/summaries-length-for-user";
import LimitCountBar from "../summaries/limit-count-bar";
import {upload_file_schema} from "@/types/upload-file-type";
import { processChatUpload } from "@/utils/process-chat";

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
    onClientUploadComplete: async (res) => {
      try {
        toast("Processing PDF for Chat! This might take a minute...");
        
        const result = await processChatUpload(res[0]);
        if (result.success) {
            toast.success("Document perfectly saved!");           
        } else {
             toast.error(result.message);
        }
    } catch (error) {
        toast.error("Failed to generate chat embeddings!");
    }
    },
  });

  const handlPDF = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFiles = upload_file_schema.safeParse({file});

      if (!validatedFiles.success) {
        toast("file validation failed");
        setLoading(false);
        return;
      }

      toast("we are working on uploading your file");

      const uploadFile = await startUpload([file]);

      if (!uploadFile) {
        toast("something during file upload went wrong");
        setLoading(false);
        return;
      }

      toast("file uploaded successfully");
      setLoading(false);

      console.log("uploadedFileInfo : ", uploadFile[0].key);
      formRef.current?.reset();
    } catch {
      setLoading(false);
      console.error("something went wrong while uploading the file to uploadThings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto my-2 text-center">
      {summariesCount <= 5 ? (
        <UploadFormInputPDF
          isLoading={loading}
          ref={formRef}
          onsubmit={handlPDF}
        />
      ) : (
        <LimitCountBar />
      )}
    </div>
  );
}
