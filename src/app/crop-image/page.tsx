"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import ToolWrapper from "@/components/ToolWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";

export default function CropImagePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    handleUpload(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 60,
    height: 60,
    x: 20,
    y: 20,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCompletedCrop(null);
    };
    reader.readAsDataURL(file);
    setZoom(1);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file);
  };

  const downloadCroppedImage = async () => {
    if (!imgRef || !completedCrop) return;

    try {
      setIsCropping(true);

      const canvas = document.createElement("canvas");
      const scaleX = imgRef.naturalWidth / (imgRef.width * zoom);
      const scaleY = imgRef.naturalHeight / (imgRef.height * zoom);

      canvas.width = Math.floor(completedCrop.width * scaleX);
      canvas.height = Math.floor(completedCrop.height * scaleY);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        imgRef,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
      );

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cropped-image.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } finally {
      setIsCropping(false);
    }
  };

  //for mouse wheel zoom
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    window.addEventListener("wheel", (e) => e.ctrlKey && e.preventDefault(), {
      passive: false,
    });

    if (!e.ctrlKey) return; // only zoom if Ctrl is pressed

    e.preventDefault();

    setZoom((prev) => {
      const next = prev + (e.deltaY > 0 ? -0.1 : 0.1);
      return Math.min(3, Math.max(1, Number(next.toFixed(2))));
    });
  };

  const getZoomTranslateX = () => {
    if (!completedCrop) return 0;
    return -(completedCrop.x + completedCrop.width / 2) * (zoom - 1);
  };

  const getZoomTranslateY = () => {
    if (!completedCrop) return 0;
    return -(completedCrop.y + completedCrop.height / 2) * (zoom - 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex !justify-center text-center px-4 pt-12">
      <ToolWrapper
        title="Crop Image"
        description="Crop your image like Photoshop — resize the crop box and download the cropped image."
        afterDescription={
          <div className="flex justify-center">
            <img
              src="/crop.png"
              alt="Image Crop icon"
              className="h-12 w-auto"
            />
          </div>
        }
      >
        {/* Upload */}
        <div className="space-y-3 mb-5">
          {/* Hidden file input */}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />

          {/* Custom Upload Button */}
          {!imageSrc && (
            <Button
              className="!text-white"
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              size="xl"
            >
              <Upload className="!w-6 !h-6" />
              Upload Image
            </Button>
          )}

          {imageSrc && (
            <Button
              variant="destructive"
              className=""
              onClick={() => {
                setImageSrc(null);
                setCompletedCrop(null);
                setImgRef(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setZoom(1);
              }}
            >
              Remove Image
            </Button>
          )}
        </div>

        {imageSrc && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Zoom</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(zoom * 100)}%
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        {/* Crop Area */}
        {!imageSrc ? (
          <div className="text-sm text-muted-foreground">
            Upload an image to start cropping.
          </div>
        ) : (
          <>
            <div
              className="border rounded-xl p-3 bg-white mb-4 overflow-auto"
              onWheel={handleWheelZoom}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                keepSelection
              >
                <div
                  style={{
                    display: "inline-block",
                    transformOrigin: "top left",
                    transform: `translate(${getZoomTranslateX()}px, ${getZoomTranslateY()}px) scale(${zoom})`,
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Crop source"
                    onLoad={(e) => setImgRef(e.currentTarget)}
                    className="max-h-[480px] w-auto mx-auto"
                  />
                </div>
              </ReactCrop>
            </div>
            <div className="flex justify-center">
              <Button
                disabled={!completedCrop || isCropping}
                onClick={downloadCroppedImage}
                variant="primary"
                size="xl"
              >
                <Download size={18} />
                {isCropping ? "Cropping..." : "Download Cropped Image"}
              </Button>
            </div>
          </>
        )}
        {/* drag and drop */}
        {!imageSrc && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            className={`mt-6 mx-auto max-w-xl
    border-2 border-dashed rounded-xl
    px-6 py-20 cursor-pointer transition bg-white hover:bg-gray-100
    ${
      isDragging
        ? "border-blue-600 bg-blue-50"
        : "border-gray-300 hover:border-blue-400"
    }
  `}
          >
            <div className="flex flex-col items-center">
              <img
                className="h-12 w-12 opacity-50"
                src="./dragdrop.png"
                alt="drag and drop"
              />
              <p className="text-gray-600 font-medium">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-400 mt-1">or click to browse</p>
            </div>
          </div>
        )}
      </ToolWrapper>
    </div>
  );
}
