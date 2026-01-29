import FileConverter from "@/components/FileConverter";
import { Image } from "lucide-react";

export default function JpegToPngPage() {
  return (
    <FileConverter
      title="JPEG to PNG Converter"
      description="Convert your JPEG images to high-quality PNG files quickly."
      apiEndpoint="/api/jpeg-to-png"
      accept=".jpg,.jpeg"
      outputFileName="converted.png"
      buttonText="Convert JPEG to PNG"
      fromIcon={<Image className="w-8 h-8 text-orange-500" />} // JPEG
      toIcon={<Image className="w-8 h-8 text-green-600" />} // PNG
    />
  );
}
