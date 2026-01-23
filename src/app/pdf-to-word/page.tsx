import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";

export default function PdfToWordPage() {
  return (
    <FileConverter
      title="PDF to Word Converter"
      description="Convert your PDF files to Word documents quickly and easily."
      apiEndpoint="/api/pdf-to-word"
      accept="application/pdf"
      outputFileName="converted.docx"
      buttonText="Convert PDF to Word"
      fromIcon={<FileText className="w-8 h-8 text-red-600" />}
      toIcon={<FileText className="w-8 h-8 text-blue-600" />}
    />
  );
}
