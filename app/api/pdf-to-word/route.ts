import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';
const pdfParse = require('pdf-parse');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const textContent = pdfData.text || "Không thể trích xuất văn bản từ PDF này.";

    // Split text into paragraphs
    const lines = textContent.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    const paragraphs = lines.map((line: string) => 
      new Paragraph({
        children: [new TextRun(line)],
      })
    );

    // Create Word Doc
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [
          new Paragraph({
            children: [new TextRun("Không tìm thấy văn bản nào trong PDF.")],
          })
        ],
      }],
    });

    // Generate buffer
    const docxBuffer = await Packer.toBuffer(doc);

    const fileName = file.name.replace(/\.pdf$/i, '') + '.docx';
    
    return new NextResponse(docxBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF to Word Error:", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
