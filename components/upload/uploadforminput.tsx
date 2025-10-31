"use client";

import {forwardRef, Ref} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {cn} from "@/lib/utils";
import {Loader2} from "lucide-react";

interface UploadFormInputProps {
  onsubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const UploadFormInputPDF = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({onsubmit, isLoading}, ref) => {
  return (
    <form action="" className="flex flex-col g-6" onSubmit={onsubmit} ref={ref}>
      <div className="flex justify-center items-center gap-1.5">
        <Input
          id="file"
          name="file"
          accept="application/pdf"
          required
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          type="file"
          disabled={isLoading}
        />
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...{" "}
            </>
          ) : (
            "summariZE PDF"
          )}
        </Button>
      </div>
    </form>
  );
});

export const UploadFormInputYouTube = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({onsubmit, isLoading}, ref) => {
  return (
    <form action="" className="flex flex-col g-6" onSubmit={onsubmit} ref={ref}>
      <div className="flex justify-center items-center gap-1.5">
        <Input
          id="youtubeLink"
          name="youtubeLink"
          required
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          type="text"
          disabled={isLoading}
          placeholder="Paste your YouTube Video link here"
        />
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...{" "}
            </>
          ) : (
            "summariZE Video"
          )}
        </Button>
      </div>
    </form>
  );
});

export const UploadFormInputWebsite = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({onsubmit, isLoading}, ref) => {
  return (
    <form action="" className="flex flex-col g-6" onSubmit={onsubmit} ref={ref}>
      <div className="flex justify-center items-center gap-1.5">
        <Input
          id="website"
          name="websiteLink"
          required
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
          type="text"
          disabled={isLoading}
          placeholder="Paste your Website link here"
        />
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...{" "}
            </>
          ) : (
            "summariZE IT"
          )}
        </Button>
      </div>
    </form>
  );
});

export const UploadFormWorkingOn = () => {
  return (
    <>
      <div className="mb-6">
        <div className="bg-rose-50 border border-rose-200 rounded-md p-1 pl-4 text-rose-800 flex items-center j">
          <p className="text-sm">
            Currently Working on It
          </p>
        </div>
      </div>
    </>
  );
};
