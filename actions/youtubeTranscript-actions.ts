"use server"

import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

interface youTubeTranscriptProps{
    link : string
}

export async function youTubeTranscript(props : youTubeTranscriptProps) {
    const loader = YoutubeLoader.createFromUrl(props.link, {
        language: "en",
        addVideoInfo: true,
    });

    const docs = await loader.load();
    const pageContent = docs[0].pageContent;
    const title = docs[0].metadata.title
    console.log(docs);
    console.log('docs pagecontent : ',docs[0].pageContent);
    
    return {pageContent, title}
}
