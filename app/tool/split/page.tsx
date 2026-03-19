'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function SplitPdfPage() {
  const [pageRange, setPageRange] = useState('');

  const parsePageRange = (rangeText: string, totalPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeText.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) pages.add(i - 1);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num > 0 && num <= totalPages) {
          pages.add(num - 1);
        }
      }
    });
    
    if (pages.size === 0) {
      throw new Error("Dải trang không hợp lệ.");
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();
    
    let pagesToExtract: number[];
    if (!pageRange.trim()) {
      throw new Error("Vui lòng nhập dải trang cần cắt (VD: 1-5, 8, 11-13).");
    } else {
      pagesToExtract = parsePageRange(pageRange, totalPages);
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Trang cần cắt ra:</label>
      <input 
        type="text" 
        placeholder="VD: 1-5, 8, 11-13" 
        value={pageRange}
        onChange={(e) => setPageRange(e.target.value)}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.2)',
          color: 'white',
          outline: 'none',
          fontSize: '1rem'
        }}
      />
      <small style={{ color: 'rgba(255,255,255,0.5)' }}>Nhập các trang bạn muốn trích xuất thành 1 file mới.</small>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Cắt PDF"
      description="Trích xuất các trang bạn cần từ một file PDF lớn."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
    />
  );
}
