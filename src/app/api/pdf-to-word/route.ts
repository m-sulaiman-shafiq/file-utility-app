export const runtime = "nodejs";

import { NextResponse } from "next/server";
import * as pdfParse from "pdf-parse";
import { Document, Packer, Paragraph } from "docx";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const pdfData = await pdfParse.default(buffer);

  const doc = new Document({
    sections: [
      {
        children: pdfData.text
          .split("\n")
          .map((line) => new Paragraph(line)),
      },
    ],
  });

  const docBuffer = await Packer.toBuffer(doc);

  return new NextResponse(docBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="converted.docx"`,
    },
  });
}
