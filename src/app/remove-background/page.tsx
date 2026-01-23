import FileConverter from "@/components/FileConverter";
import { Image, Scissors } from "lucide-react";

export default function RemoveBackgroundPage() {
  return (
    <FileConverter
      title="Remove Background from Image"
      description="Upload an image and remove its background automatically."
      apiEndpoint="/api/remove-background"
      accept=".jpg,.jpeg,.png"
      outputFileName="transparent.png"
      buttonText="Remove Background"
      fromIcon={<Image className="w-8 h-8 text-purple-600" />}   // Original image
      toIcon={<Scissors className="w-8 h-8 text-teal-500" />}    // Background removed
    />
  );
}
