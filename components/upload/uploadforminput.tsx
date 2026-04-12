"use client";

import {forwardRef, useRef} from "react";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import AnimatedFileUpload from "./upload-file";
import InitialOption from "./choose-intial-option";

interface UploadFormInputProps {
  onsubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const UploadFormInputPDF = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({onsubmit, isLoading}, ref) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="w-full justify-items-center mb-10">
        <h1 className="font-bold text-3xl text-center ">Upload your PDF</h1>
        <p className="text-center text-muted-foreground">Upload PDF and choose what you want to do with it.</p>   
      </div>
    <form className="flex flex-col g-6" onSubmit={onsubmit} ref={ref}>
      <div className="">
        <AnimatedFileUpload
          accept=".pdf"
          disabled={isLoading}
          multiple={false}
          maxSize={10 * 1024 * 1024}
          className="mb-5 shadow-lg rounded-lg backdrop-blur-md"
          onFilesSelected={(files: File[]) => {
            if (hiddenInputRef.current) {
              if (files.length > 0) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                hiddenInputRef.current.files = dataTransfer.files;
              } else {
                hiddenInputRef.current.value = "";
              }
            }
          }}
        />

        <input 
          type="file" 
          ref={hiddenInputRef} 
          name="file" 
          className="hidden" 
        />
        <InitialOption />
        <p className="text-xs text-left font-light mt-2">*Choose any one option from above now, you can select other options later also for the same PDF.</p>
        <Button type="submit" disabled={isLoading} className="w-full mt-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...{" "}
            </>
          ) : (
            "Submit PDF"
          )}
        </Button>
      </div>
    </form>
    </div>
  );
});