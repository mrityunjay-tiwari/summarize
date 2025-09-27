"use client";

import { forwardRef, Ref } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface UploadFormInputProps {
  onsubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onsubmit, isLoading }, ref) => {
    return (
      <form
        action=""
        className="flex flex-col g-6"
        onSubmit={onsubmit}
        ref={ref}
      >
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
              "Upload your PDF"
            )}
          </Button>
        </div>
      </form>
    );
  }
);

export default UploadFormInput;
