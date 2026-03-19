'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function DeletePagesPdfPage() {
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
    
    return Array.from(pages);
  };

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();
    
    let pagesToRemove: number[];
    if (!pageRange.trim()) {
      throw new Error("Vui lòng nhập dải trang cần xóa (VD: 1-5, 8).");
    } else {
      pagesToRemove = parsePageRange(pageRange, totalPages);
    }

    const pagesToKeep = [];
    for (let i = 0; i < totalPages; i++) {
      if (!pagesToRemove.includes(i)) {
        pagesToKeep.push(i);
      }
    }

    if (pagesToKeep.length === 0) {
      throw new Error("Không thể xóa tất cả các trang. Dải trang không hợp lệ.");
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Trang cần xóa bỏ:</label>
      <input 
        type="text" 
        placeholder="VD: 1, 3-5, 7" 
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
      <small style={{ color: 'rgba(255,255,255,0.5)' }}>Nhập các trang bạn muốn xóa khỏi file PDF này.</small>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Xóa trang PDF"
      description="Loại bỏ các trang không cần thiết khỏi tài liệu của bạn."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
    />
  );
}
