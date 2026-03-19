'use client';
import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function RotatePdfPage() {
  const [angle, setAngle] = useState(90);

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    const pages = pdf.getPages();
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    });

    const pdfBytes = await pdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Chọn góc xoay:</label>
      <select 
        value={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
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
        <option value={90} style={{ color: 'black' }}>Quay Trái 90° (Cùng chiều kim đồng hồ)</option>
        <option value={-90} style={{ color: 'black' }}>Quay Phải 90° (Ngược chiều kim đồng hồ)</option>
        <option value={180} style={{ color: 'black' }}>Lật ngược 180°</option>
      </select>
      <small style={{ color: 'rgba(255,255,255,0.5)' }}>Tất cả các trang sẽ được chuyển hướng theo góc này.</small>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Xoay PDF"
      description="Đảo chiều nhanh chóng các trang tài liệu bị ngược."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
    />
  );
}
