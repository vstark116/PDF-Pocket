'use client';
import { PDFDocument } from 'pdf-lib';
import ToolPageTemplate from '@/components/ToolPageTemplate';

export default function MergePdfPage() {
  const handleProcess = async (files: File[]): Promise<Blob> => {
    if (files.length < 2) {
      throw new Error("Vui lòng tải lên ít nhất 2 file PDF để ghép.");
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfToMerge = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
      
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  return (
    <ToolPageTemplate
      title="Ghép PDF"
      description="Gộp nhiều file PDF lại làm một nhanh chóng và an toàn."
      multiple={true}
      onProcess={handleProcess}
    />
  );
}
