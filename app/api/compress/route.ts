import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Create ZIP
    const zip = new JSZip();
    zip.file(file.name, arrayBuffer);
    
    // Generate ZIP
    const zipData = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9 // Maximum compression
      }
    });

    const fileName = file.name.replace(/\.pdf$/i, '') + '_compressed.zip';
    
    return new NextResponse(zipData as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
