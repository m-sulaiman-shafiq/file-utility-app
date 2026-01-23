import FileConverter from "@/components/FileConverter";
import { FileText, ArrowDown } from "lucide-react";

export default function PdfCompressorPage() {
  return (
    <FileConverter
      title="PDF Compressor"
      description="Upload your PDF files and compress them to reduce file size without losing quality."
      apiEndpoint="/api/pdf-compress"
      accept="application/pdf"
      outputFileName="compressed.pdf"
      buttonText="Compress PDF"
      fromIcon={<FileText className="w-8 h-8 text-red-600" />}    // Original PDF
      toIcon={<ArrowDown className="w-8 h-8 text-blue-600" />}     // Compressed PDF
    />
  );
}
