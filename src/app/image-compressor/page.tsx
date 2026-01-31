"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Mode = "targetSize" | "percentage";
type SizeUnit = "KB" | "MB";

export default function ImageCompressorPage() {
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
    if (targetUnit === "KB") return parsedTargetSize >= 1 && parsedTargetSize <= 30000;
    return parsedTargetSize >= 0.1 && parsedTargetSize <= 30;
  }, [isTargetSizeMode, parsedTargetSize, targetUnit]);

  const isValidPercentage = useMemo(() => {
    if (!isPercentageMode) return true;
    if (!Number.isFinite(parsedPercentage)) return false;
    return parsedPercentage >= 1 && parsedPercentage <= 99;
  }, [isPercentageMode, parsedPercentage]);

  const canCompress = isValidTargetSize && isValidPercentage;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">Image Compressor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compress JPG/PNG/WebP images by selecting either a target size or a percentage.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload placeholder (we will connect later) */}
          <div className="rounded-2xl border border-dashed p-6 text-center">
            <p className="text-sm font-medium">Drop your image here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click upload (we will connect upload logic next)
            </p>
            <div className="mt-4">
              <Button variant="secondary" className="rounded-xl">
                Upload Image
              </Button>
            </div>
          </div>

          <Separator />

          {/* Two-row compressor controls */}
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
            className="space-y-5"
          >
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-2xl border p-4">
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
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-2xl border p-4">
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

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
            <Button variant="outline" className="rounded-xl">
              Reset
            </Button>

            <Button className="rounded-xl" disabled={!canCompress}>
              Compress Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
