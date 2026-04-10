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
import { upload_file_schema } from "@/types/upload-file-type";
import { TMindMapSchema } from "@/app/api/mind-map/schema";

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
    // onUploadBegin: (fileName) => {
    //   console.log("upload has begun for", fileName);
    // },
    // onUploadError: (er) => {
    //   console.error("error occurred while uploading", er);
    //   toast("error occured while uploading", {
    //     description:
    //       "Due to some error you were unable to upload the file, please try again",
    //   });
    // },
    // onClientUploadComplete: (file) => {
    //   console.log("uploaded successfully!");
    //   file.forEach((fl) => {
    //     console.log('fl info : ', fl);
    //   });
    // }
    onClientUploadComplete: async (res) => {  
      console.log('Log from : ', res[0])    
      const theUploadedFile = await fetch(res[0].ufsUrl)
      console.log('The Second Log : ', res[0].ufsUrl)
      const fileText = await fetch(`https://mrityunjay18-structured-pdf-retrieval.hf.space/get-chunks?source=${res[0].ufsUrl}`)
      const fileJson = await fileText.json();
      console.log('The Third Log : ', fileJson);
      const chunks = fileJson.chunks;
      const allTexts = chunks.map((chunk: any) => chunk.text)
      const getFlashCardsDisplayableSummary = await fetch('/api/get-embeddings', {
        method: 'POST',
        body: JSON.stringify({
          text: allTexts
        })
      });

      const embeddingResponse = await getFlashCardsDisplayableSummary.json();
      console.log('The Fourth Log(Embeddings) : ', embeddingResponse);

      const finalEmbeddingData = chunks.map((chunk: any, index: any) => {
        return {
          text: chunk.text,
          meta: chunk.meta,
          embedding: embeddingResponse.embeddings.embeddings[index]
        }
      })

      console.log('The Final Embedding Data : ', finalEmbeddingData)
      // const flashCardsDisplayableSummary = await getFlashCardsDisplayableSummary.json();
      // console.log('The Fourth Log(Summary) : ', flashCardsDisplayableSummary);
      // const myMindMapArray: TMindMapSchema[] = [
      //   {
      //     index: 0,
      //     point: flashCardsDisplayableSummary.result,
      //     subPoints: flashCardsDisplayableSummary.topic
      //   }
      // ]
      // console.log('The final mindMap: ', myMindMapArray[0])
    }
  });

  const handlPDF = async(e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFiles = upload_file_schema.safeParse({file});

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

      console.log("uploadedFileInfo : ", uploadFile[0].key);
     
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