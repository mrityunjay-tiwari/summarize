import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

export async function fetchAndExtractPDFText(fileUrl: string) {
    console.log("fetchAndExtractPDFText: fetching url", fileUrl);
    try {
        const response = await fetch(fileUrl);
        console.log("fetch response status:", response.status);

        if (!response.ok) {
             throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log("blob created, size:", blob.size);

        const arrayBuffer = await blob.arrayBuffer();
        console.log("arrayBuffer created, byteLength:", arrayBuffer.byteLength);

        const loader = new PDFLoader(new Blob([arrayBuffer]));
        console.log("PDFLoader initialized");

        const docs = await loader.load();
        console.log("docs loaded, count:", docs.length);

        console.log("docs pagecontent : ",docs[0].pageContent);
        
        return docs.map((doc) => doc.pageContent).join('\n');
    } catch (error) {
        console.error("Error in fetchAndExtractPDFText:", error);
        throw error;
    }
}