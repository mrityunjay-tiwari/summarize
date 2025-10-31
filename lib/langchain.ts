// import { Document } from 'langchain/document'
// import pdf from 'pdf-parse';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

export async function fetchAndExtractPDFText(fileUrl: string) {
    const response = await fetch(fileUrl);

    // const arrayBuffer = await response.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // const data = await pdf(buffer);

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]));

    const docs = await loader.load();

    // const docs = [new Document({ pageContent: data.text })];

    // combine
    return docs.map((doc) => doc.pageContent).join('\n')
}