'use client';
import { useState } from 'react';
import JSZip from 'jszip';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function PdfToImgPage() {
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');

  const renderPageToBlob = async (page: any, scale: number, format: string): Promise<Blob> => {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not create canvas context");
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        `image/${format}`,
        1.0 // maximum quality
      );
    });
  };

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    // Load library dynamically to prevent Server-Side Rendering (Next.js Build) crashes
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const totalPages = pdf.numPages;

    const zip = new JSZip();

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      // Use scale 2 for high quality
      const blob = await renderPageToBlob(page, 2.0, format);
      zip.file(`page_${pageNum}.${format}`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return zipBlob;
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Định dạng ảnh:</label>
      <select 
        value={format}
        onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png')}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.2)',
          color: 'white',
          outline: 'none',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        <option value="jpeg" style={{ color: 'black' }}>JPEG (Chất lượng cao, dung lượng nhỏ)</option>
        <option value="png" style={{ color: 'black' }}>PNG (Chất lượng cao nhất, có trong suốt)</option>
      </select>
    </div>
  );

  return (
    <ToolPageTemplate
      title="PDF sang Ảnh"
      description="Chuyển đổi mỗi trang PDF thành một bức ảnh rõ nét."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
      resultExtension="zip"
    />
  );
}
