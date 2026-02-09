export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Document, Packer, Paragraph } from "docx";

const pdfParse = require("pdf-parse");

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfData = await pdfParse(buffer);

  const doc = new Document({
    sections: [
      {
        children: pdfData.text
          .split("\n")
          .map((line: string) => new Paragraph(line)),
      },
    ],
  });

  const docBuffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(docBuffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="converted.docx"`,
    },
  });
}
