import ToolWrapper from "@/components/ToolWrapper";
import { Button } from "@/components/ui/button";

export default function PdfToWordPage() {
  return (
    <ToolWrapper
      title="PDF to Word Converter"
      description="Convert your PDF files to Word documents quickly and easily."
    >
      {/* Upload section */}
      <input
        type="file"
        accept="application/pdf"
        className="border p-2 rounded w-full mb-4"
      />

      {/* Convert button */}
      <Button className="w-full">Convert PDF to Word</Button>
    </ToolWrapper>
  );
}
