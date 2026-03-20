'use client';
import { useState } from 'react';
import { UploadCloud, CheckCircle2, ArrowLeft, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import styles from './ToolPageTemplate.module.css';

interface ToolPageProps {
  title: string;
  description: string;
  onProcess: (files: File[]) => Promise<Blob | string>;
  multiple?: boolean;
  optionsUI?: React.ReactNode;
  resultExtension?: string;
  accept?: string;
  uploadText?: string;
}

export default function ToolPageTemplate({ title, description, onProcess, multiple = false, optionsUI, resultExtension = 'pdf', accept = '.pdf', uploadText = 'Kéo thả file PDF vào đây' }: ToolPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => multiple ? [...prev, ...droppedFiles] : [droppedFiles[0]]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => multiple ? [...prev, ...selectedFiles] : [selectedFiles[0]]);
    }
  };

  const handleStartProcess = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    try {
      const result = await onProcess(files);
      if (result instanceof Blob) {
        setResultUrl(URL.createObjectURL(result));
      } else {
        setResultUrl(result);
      }
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Có lỗi xảy ra trong quá trình xử lý!');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <main className={styles.mainArea}>
        {status === 'idle' && files.length === 0 && (
          <div
            className={styles.dropzone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadCloud size={64} className={styles.uploadIcon} />
            <h2>{uploadText}</h2>
            <p>hoặc</p>
            <label className={styles.fileLabel}>
              Chọn file
              <input type="file" accept={accept} multiple={multiple} className={styles.hiddenInput} onChange={handleFileChange} />
            </label>
          </div>
        )}

        {status === 'idle' && files.length > 0 && (
          <div className={styles.workspace}>
            <div className={styles.filePreview}>
              {files.map((file, idx) => (
                <div key={idx} className={styles.fileItem}>
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
              {multiple && (
                <label className={styles.addMoreLabel}>
                  + Thêm file khác
                  <input type="file" accept={accept} multiple className={styles.hiddenInput} onChange={handleFileChange} />
                </label>
              )}
            </div>

            {optionsUI && (
              <div className={styles.optionsContainer}>
                {optionsUI}
              </div>
            )}

            <button className={styles.primaryButton} onClick={handleStartProcess}>
              Bắt đầu xử lý
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className={styles.processing}>
            <Loader2 size={64} className={styles.spinner} />
            <h2>Đang xử lý tài liệu của bạn...</h2>
            <p>Vui lòng đợi trong giây lát...</p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.success}>
            <CheckCircle2 size={80} className={styles.successIcon} />
            <h2>Hoàn tất!</h2>
            <p>File của bạn đã sẵn sàng để tải xuống.</p>
            {resultUrl && (
              <a href={resultUrl} download={`processed_result.${resultExtension}`} className={styles.downloadButton}>
                <Download size={24} />
                <span>Tải xuống ngay</span>
              </a>
            )}
            <button className={styles.secondaryButton} onClick={() => {
              setFiles([]);
              setStatus('idle');
              setResultUrl(null);
            }}>
              Xử lý file khác
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
