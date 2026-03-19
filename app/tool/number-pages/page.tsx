'use client';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function NumberPagesPdfPage() {
  const [position, setPosition] = useState('bottomRight');

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const pages = pdf.getPages();
    pages.forEach((page, idx) => {
      const { width, height } = page.getSize();
      const text = `${idx + 1}`;
      const textSize = 12;
      const textWidth = font.widthOfTextAtSize(text, textSize);
      
      let x = 0;
      let y = 0;
      
      switch (position) {
        case 'bottomRight':
          x = width - textWidth - 20;
          y = 20;
          break;
        case 'bottomCenter':
          x = width / 2 - textWidth / 2;
          y = 20;
          break;
        case 'topRight':
          x = width - textWidth - 20;
          y = height - 20 - textSize;
          break;
        case 'topCenter':
          x = width / 2 - textWidth / 2;
          y = height - 20 - textSize;
          break;
      }

      page.drawText(text, {
        x,
        y,
        size: textSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Vị trí đánh số:</label>
      <select 
        value={position}
        onChange={(e) => setPosition(e.target.value)}
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
        <option value="bottomRight" style={{ color: 'black' }}>Góc dưới cùng bên phải</option>
        <option value="bottomCenter" style={{ color: 'black' }}>Chính giữa bên dưới</option>
        <option value="topRight" style={{ color: 'black' }}>Góc trên cùng bên phải</option>
        <option value="topCenter" style={{ color: 'black' }}>Chính giữa bên trên</option>
      </select>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Đánh số trang"
      description="Thêm số trang tự động vào tài liệu PDF của bạn."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
    />
  );
}
