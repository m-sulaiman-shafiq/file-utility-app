import FileConverter from "@/components/FileConverter";

export default function PdfToWordPage() {
  return (
    <FileConverter
      title="PDF to Word Converter"
      description="Convert your PDF files to Word documents quickly and easily."
      apiEndpoint="/api/pdf-to-word"
      accept="application/pdf"
      outputFileName="converted.docx"
      buttonText="Convert PDF to Word"
    />
  );
}
