"use client";

import { deletePdfFile } from "@/actions/upload-actions";
import { UploadButton } from "@/utils/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
      className="bg-black text-white rounded-full"
        endpoint="pdfUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <form action={deletePdfFile}>
        <button type="submit">delete pdf file</button>
      </form>
    </main>
  );
}
