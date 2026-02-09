"use client";

import { useRef, useState } from "react";
import { Upload, FileText, ArrowRight, Download } from "lucide-react";
import { Button } from "./ui/button";

type FileConverterProps = {
  title: string;
  description: string;
  apiEndpoint: string;
  accept: string;
  outputFileName: string;
  buttonText: string;
  fromIcon: React.ReactNode;
  toIcon: React.ReactNode;
};

export default function FileConverter({
  title,
  description,
  apiEndpoint,
  accept,
  outputFileName,
  buttonText,
  fromIcon,
  toIcon,
}: FileConverterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setReady(false);
    setDownloadUrl(null);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setReady(true);
    } finally {
      setLoading(false);
    }
  };

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

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = outputFileName;
    a.click();
  };

  return (
    <div className="bg-gray-50 flex justify-center px-4 pt-12 pb-8">
      <div className="w-full max-w-3xl text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
        {/* Description with icons */}
        <p className="text-gray-600 flex items-center justify-center gap-2 flex-wrap">
          {description}
        </p>
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl">
            {fromIcon}
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="w-14 h-14 flex items-center justify-center rounded-xl">
            {toIcon}
          </div>
        </div>
        {file && (
          <div className="my-2 flex flex-col justify-center items-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              className="max-h-16 rounded border"
            />
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        {/* Upload button */}
        {!file ? (
          <button
            onClick={handleButtonClick}
            className="mx-auto flex items-center justify-center gap-3
               bg-blue-600 hover:bg-blue-700
               text-white text-lg font-semibold
               px-10 py-6 rounded-xl
               shadow-lg transition"
          >
            <Upload className="w-6 h-6" />
            {buttonText}
          </button>
        ) : ready ? (
          <button
            onClick={handleDownload}
            className="mx-auto flex items-center justify-center gap-3
               bg-red-600 hover:bg-red-700
               text-white text-lg font-semibold
               px-10 py-6 rounded-xl
               shadow-lg transition"
          >
            <Download className="!w-6 !h-6" />
            Download Now (1)
          </button>
        ) : (
          <button
            onClick={handleConvert}
            disabled={loading}
            className="mx-auto flex items-center justify-center gap-3
               bg-green-600 hover:bg-green-700
               text-white text-lg font-semibold
               px-10 py-6 rounded-xl
               shadow-lg transition"
          >
            {loading ? "Converting..." : "Convert Now"}
          </button>
        )}
        {/* drag and drop */}
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
        {file && (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end mr-24 mt-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setFile(null)}
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
