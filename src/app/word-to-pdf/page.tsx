import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";

export default function WordToPdfPage() {
  return (
    <FileConverter
      title="Word to PDF Converter"
      description="Convert your Word documents to PDF quickly and easily."
      apiEndpoint="/api/word-to-pdf"
      accept=".doc,.docx"
      outputFileName="converted.pdf"
      buttonText="Convert Word to PDF"
      fromIcon={<FileText className="w-8 h-8 text-blue-600" />}   // Word
      toIcon={<FileText className="w-8 h-8 text-red-600" />}    // PDF
    />
  );
}
