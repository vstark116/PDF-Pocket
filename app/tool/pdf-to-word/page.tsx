'use client';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function PdfToWordPage() {
  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) throw new Error("Vui lòng tải lên 1 file PDF.");
    const file = files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/pdf-to-word', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('API xử lý thất bại');
    }
    
    return await response.blob();
  };

  return (
    <ToolPageTemplate
      title="PDF sang Word"
      description="Chuyển đổi file PDF tĩnh thành văn bản Word (.docx) có thể chỉnh sửa."
      multiple={false}
      onProcess={handleProcess}
      resultExtension="docx"
    />
  );
}
