"use client";

import { useRef, useState } from "react";
import { Upload, FileText, ArrowRight } from "lucide-react";
import ToolWrapper from "@/components/ToolWrapper";

type FileConverterProps = {
  title: string;
  description: string;
  apiEndpoint: string;
  accept: string;
  outputFileName: string;
  buttonText: string;
};

export default function FileConverter({
  title,
  description,
  apiEndpoint,
  accept,
  outputFileName,
  buttonText,
}: FileConverterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = outputFileName;
      a.click();

      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 pt-24">
      <div className="w-full max-w-3xl text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        {/* Description with icons */}
        <p className="text-gray-600 mb-10 flex items-center justify-center gap-2 flex-wrap">
          <FileText className="w-5 h-5 text-blue-600" />
          {description}
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-700">
            Fast & Secure
          </span>
        </p>

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

        {/* Helper text */}
        <p className="mt-4 text-sm text-gray-500">
          or drop file here
        </p>
      </div>
    </div>
  );
}
