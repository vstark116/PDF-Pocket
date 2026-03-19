'use client';
import { useState } from 'react';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function CompressPdfPage() {
  const [level, setLevel] = useState('recommended');

  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', level);
    
    const response = await fetch('/api/compress', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('API xử lý thất bại');
    }
    
    return await response.blob();
  };

  const optionsUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <label style={{ fontWeight: 600 }}>Mức độ nén:</label>
      <select 
        value={level}
        onChange={(e) => setLevel(e.target.value)}
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
        <option value="recommended" style={{ color: 'black' }}>Khuyên dùng (Cân bằng giữa chất lượng & dung lượng)</option>
        <option value="extreme" style={{ color: 'black' }}>Nén tối đa (Chất lượng giảm nhẹ, dung lượng cực nhỏ)</option>
        <option value="low" style={{ color: 'black' }}>Nén ít (Giữ nguyên tối đa chất lượng)</option>
      </select>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Nén PDF"
      description="Giảm dung lượng file PDF để dễ dàng chia sẻ qua email."
      multiple={false}
      onProcess={handleProcess}
      optionsUI={optionsUI}
    />
  );
}
