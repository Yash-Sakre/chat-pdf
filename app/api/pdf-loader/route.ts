import { NextResponse } from "next/server"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";



export async function GET(req:any){

    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl)
    const pdfUrl = searchParams.get("pdfUrl") as string;
    
    console.log(pdfUrl)

    // Loading pdf file
    const fetchPdfUrl = await fetch(pdfUrl)
    const reponseDataFromFetch = await fetchPdfUrl.blob()

    const loader = new WebPDFLoader(reponseDataFromFetch)
    const docs = await loader.load()

    let pdfContent = ""
    docs.forEach(doc => {pdfContent += doc.pageContent})

    //Spliting the pdf file into multiple chunks 
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });
      const texts = await textSplitter.createDocuments([pdfContent]);

    // Making a list of all the chunks

    let pdfContentList:String[] = []

    texts.forEach(text => {
        pdfContentList.push(text.pageContent)
    })


    return NextResponse.json({result:pdfContentList})

}