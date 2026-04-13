"use client";

import {useUploadThing} from "@/utils/uploadthing";
import {UploadFormInputPDF} from "./uploadforminput";
import {toast} from "sonner";
import {FormEvent, useRef, useState} from "react";
import LimitCountBar from "../summaries/limit-count-bar";
import {upload_file_schema} from "@/types/upload-file-type";
import {processChatUpload} from "@/utils/process-chat";

export default function UploadForm({initialCount}: {initialCount: number}) {
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<string>("1"); 
  const [loading, setLoading] = useState(false);

  const {startUpload} = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      try {
        const intent = intentRef.current;
        
        if (intent === "1") {
            toast("Processing PDF for Chat! This might take a minute...");
            const result = await processChatUpload(res[0]);
            if (result.success) {
              toast.success("Document perfectly saved for Chat!");
            } else {
              toast.error(result.message);
            }
        } else if (intent === "2") {
            toast.success("Flashcards route is selected! Ready to build.");
        } else if (intent === "3") {
            toast.success("Quiz route is selected! Ready to build.");
        } else if (intent === "4") {
            toast.success("Mind Map route is selected! Ready to build.");
        }
        
      } catch (error) {
        toast.error("Failed to process document!");
      } finally {
        setLoading(false);
      }
    },
  });

  const handlPDF = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      
      const intent = formData.get("intent") as string;
      intentRef.current = intent;
      
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
      console.error(
        "something went wrong while uploading the file to uploadThings",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto my-2 text-center">
      {initialCount <= 5 ? (
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
