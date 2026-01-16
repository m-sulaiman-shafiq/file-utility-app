import ToolWrapper from "@/components/ToolWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WordToPdfPage() {
  return (
    <ToolWrapper
      title="PDF to Word Converter"
      description="Convert your PDF files to Word documents quickly and easily."
    >
      {/* Upload section */}
      <Input type="file" accept=".doc,.docx" className="mb-4" />

      {/* Convert button */}
      <Button className="w-full">Convert PDF to Word</Button>
    </ToolWrapper>
  );
}
