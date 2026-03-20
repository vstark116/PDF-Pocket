'use client';
import { PDFDocument } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function ImageToPdfPage() {
  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length === 0) {
      throw new Error("Vui lòng tải lên ít nhất 1 hình ảnh.");
    }

    const pdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      
      try {
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdf.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdf.embedPng(arrayBuffer);
        } else {
          throw new Error('Định dạng hình ảnh không được hỗ trợ. Chỉ chấp nhận JPG và PNG.');
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      } catch (err: any) {
        throw new Error(`Lỗi khi xử lý file ${file.name}: ${err.message}`);
      }
    }

    const pdfBytes = await pdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  return (
    <ToolPageTemplate
      title="Ảnh sang PDF"
      description="Nối nhiều hình ảnh của bạn thành 1 file PDF liên tục."
      multiple={true}
      onProcess={handleProcess}
      accept="image/png, image/jpeg, image/jpg"
      uploadText="Kéo thả hình ảnh vào đây"
    />
  );
}
