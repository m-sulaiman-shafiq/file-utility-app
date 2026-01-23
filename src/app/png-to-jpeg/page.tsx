import FileConverter from "@/components/FileConverter";
import { Image } from "lucide-react";

export default function PngToJpegPage() {
  return (
    <FileConverter
      title="PNG to JPEG Converter"
      description="Convert your PNG images to high-quality JPEG files quickly."
      apiEndpoint="/api/png-to-jpeg"
      accept=".png"
      outputFileName="converted.jpg"
      buttonText="Convert PNG to JPEG"
      fromIcon={<Image className="w-8 h-8 text-green-600" />}   // PNG
      toIcon={<Image className="w-8 h-8 text-orange-500" />}    // JPEG
    />
  );
}
