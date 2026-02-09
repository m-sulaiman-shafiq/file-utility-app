"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-2 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            FileTools
          </Link>

          {/* Menus */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/* Image Conversion Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition">
                Image Conversion <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-35 p-2">
                <DropdownMenuItem asChild>
                  <Link href="/jpeg-to-png">JPEG → PNG</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/png-to-jpeg">PNG → JPEG</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/word-to-pdf">Word → PDF</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/pdf-to-word">PDF → Word</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Normal Menu Items */}
            <Link
              href="/image-compressor"
              className="hover:text-primary transition"
            >
              Image Compressor
            </Link>

            <Link
              href="/crop-image"
              className="hover:text-primary transition"
            >
              Image Cropper
            </Link>
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-xl">
            Login
          </Button>

          <Button className="rounded-xl">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
