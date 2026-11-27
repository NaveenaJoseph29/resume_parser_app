import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import mammoth from "mammoth";

// pdf.js parses PDFs in a background worker. Point it at the worker file Vite bundled.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

async function readPdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let text = "";
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

async function readDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Returns plain text for a PDF, DOCX or TXT file. Everything runs in the browser.
export async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return readPdf(await file.arrayBuffer());
  if (name.endsWith(".docx")) return readDocx(await file.arrayBuffer());
  if (name.endsWith(".txt")) return file.text();
  throw new Error("Unsupported file type. Use a PDF, DOCX or TXT file.");
}
