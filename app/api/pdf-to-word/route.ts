import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Mock processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create Word Doc
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Xin chào, đây là tài liệu Word được tạo bởi PDF Pocket!",
                bold: true,
                size: 28,
              })
            ],
          }),
          new Paragraph({
            children: [
              new TextRun("\nDo giới hạn của Cloudflare Pages (Edge Runtime), hệ thống tạm thời chỉ mô phỏng việc tạo ra một file Word hợp lệ. Nội dung gốc của file PDF không được trích xuất trong phiên bản này, tuy nhiên file Word (.docx) này hoàn toàn đạt chuẩn và có thể mở để chỉnh sửa bình thường trong Microsoft Word.")
            ],
          }),
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
