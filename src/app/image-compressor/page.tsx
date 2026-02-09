"use client";
import imageCompression, { Options } from "browser-image-compression";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { Loader2, Upload } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Mode = "targetSize" | "percentage";
type SizeUnit = "KB" | "MB";

export default function ImageCompressorPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [mode, setMode] = useState<Mode>("targetSize");

  // Row 1 (target size)
  const [targetSize, setTargetSize] = useState<string>("200");
  const [targetUnit, setTargetUnit] = useState<SizeUnit>("KB");

  // Row 2 (percentage)
  const [percentage, setPercentage] = useState<string>("40");

  const isTargetSizeMode = mode === "targetSize";
  const isPercentageMode = mode === "percentage";

  const parsedTargetSize = useMemo(() => Number(targetSize), [targetSize]);
  const parsedPercentage = useMemo(() => Number(percentage), [percentage]);

  const targetSizeHelper = useMemo(() => {
    // show range based on unit
    if (targetUnit === "KB") return "from 1 KB to 30,000 KB (default 200 KB)";
    return "from 0.1 MB to 30.0 MB (default 0.2 MB)";
  }, [targetUnit]);

  const isValidTargetSize = useMemo(() => {
    if (!isTargetSizeMode) return true;
    if (!Number.isFinite(parsedTargetSize)) return false;
    if (targetUnit === "KB")
      return parsedTargetSize >= 1 && parsedTargetSize <= 30000;
    return parsedTargetSize >= 0.1 && parsedTargetSize <= 30;
  }, [isTargetSizeMode, parsedTargetSize, targetUnit]);

  const isValidPercentage = useMemo(() => {
    if (!isPercentageMode) return true;
    if (!Number.isFinite(parsedPercentage)) return false;
    return parsedPercentage >= 1 && parsedPercentage <= 99;
  }, [isPercentageMode, parsedPercentage]);

  const canCompress = isValidTargetSize && isValidPercentage;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCompress = async () => {
    if (!file) return;

    console.log("Compress button clicked!");
    console.log("Original size:", file.size / 1024, "KB");

    setIsCompressing(true);
    setCompressedFile(null);

    try {
      const options: any = {
        useWebWorker: true,
        fileType: file.type,
      };

      if (mode === "percentage") {
        options.initialQuality = parsedPercentage / 100;
      }

      if (mode === "targetSize") {
        options.maxSizeMB =
          targetUnit === "KB" ? parsedTargetSize / 1024 : parsedTargetSize;
      }

      console.log("Compression options:", options);

      const compressedBlob = await imageCompression(file, options);

      console.log("Compressed size:", compressedBlob.size / 1024, "KB");

      const compressed = new File([compressedBlob], `compressed-${file.name}`, {
        type: file.type,
      });

      setCompressedFile(compressed);
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  function handleReset() {
    setFile(null);
    setCompressedFile(null);
  }

  return (
    <div className="bg-gray-50">
      <div className=" w-full max-w-3xl mx-auto p-4 md:p-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl font-bold text-center">
              Image Compressor
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Compress JPG/PNG/WebP images by selecting either a target size or
              a percentage.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload placeholder (we will connect later) */}
            <div className="rounded-2xl border-2 border-dashed p-6 text-center">
              <p className="text-sm font-medium">Drop your image here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click upload (we will connect upload logic next)
              </p>
              <div className="mt-4 flex flex-col items-center">
                <Button
                  variant="primary"
                  className="rounded-xl"
                  size="xl"
                  onClick={handleUploadClick}
                  disabled={isCompressing}
                >
                  <Upload className="!w-6 !h-6" />
                  Upload Image
                </Button>
                {isCompressing && (
                  <p className="text-xs pt-2 text-red-600 font-bold">
                    Compressing image, please wait…
                  </p>
                )}

                {file && (
                  <div className="mt-4 flex flex-col justify-center items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      className="max-h-16 rounded border"
                    />
                    {file && (
                      <p className="text-[10px] ">
                        Current Size:{" "}
                        <span className="font-bold">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </p>
                    )}
                    {compressedFile && (
                      <div className="mt-4 rounded-xl border p-3">
                        <p className="text-sm font-medium text-green-600">
                          Compression successful 🎉
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {(file!.size / 1024).toFixed(1)} KB
                          {" → "}
                          Compressed: {(compressedFile.size / 1024).toFixed(
                            1,
                          )}{" "}
                          KB
                        </p>
                      </div>
                    )}
                    {compressedFile && (
                      <Button
                        variant="destructive"
                        className="mt-3 rounded-xl"
                        onClick={() => {
                          const url = URL.createObjectURL(compressedFile);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = compressedFile.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download Compressed Image
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Two-row compressor controls */}
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)}>
              {/* Row 1 */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-2xl border p-2">
                <div className="flex items-center gap-3 md:w-[260px]">
                  <RadioGroupItem value="targetSize" id="targetSize" />
                  <Label htmlFor="targetSize" className="font-medium">
                    Compress image to:
                  </Label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                  <Input
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    disabled={!isTargetSizeMode}
                    inputMode="decimal"
                    className="rounded-xl sm:w-[140px]"
                  />

                  <Select
                    value={targetUnit}
                    onValueChange={(v) => setTargetUnit(v as SizeUnit)}
                    disabled={!isTargetSizeMode}
                  >
                    <SelectTrigger className="rounded-xl sm:w-[120px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KB">Kbytes</SelectItem>
                      <SelectItem value="MB">Mbytes</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-xs text-muted-foreground">
                    ({targetSizeHelper})
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-2xl border p-2">
                <div className="flex items-center gap-3 md:w-[260px]">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="font-medium">
                    Compress image by:
                  </Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                  <Input
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    disabled={!isPercentageMode}
                    inputMode="numeric"
                    className="rounded-xl sm:w-[140px]"
                  />

                  <p className="text-sm font-medium">%</p>

                  <p className="text-xs text-muted-foreground">
                    (can be specified from 1% to 99%)
                  </p>
                </div>
              </div>
            </RadioGroup>
            {/* Validation messages */}
            <div className="space-y-2">
              {isTargetSizeMode && !isValidTargetSize && (
                <p className="text-sm text-destructive">
                  Please enter a valid target size.
                </p>
              )}

              {isPercentageMode && !isValidPercentage && (
                <p className="text-sm text-destructive">
                  Please enter a percentage between 1 and 99.
                </p>
              )}
            </div>
            {file && (
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                {!compressedFile && (
                  <Button
                    className="rounded-xl"
                    disabled={isCompressing || !file || !canCompress}
                    onClick={handleCompress}
                  >
                    Compress Image
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* INput for Upload BUtton */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              // console.log("Selected file now:", selected);

              setFile(selected);
              setCompressedFile(null);
            }
          }}
        />
      </div>
    </div>
  );
}
