import Link from 'next/link';
import {
  Columns, Trash2, RotateCw, FileArchive,
  Image as ImageIcon,
  FileDigit
} from 'lucide-react';
import styles from './ToolGrid.module.css';

export const TOOLS = [
  { id: 'merge', name: 'Ghép PDF', icon: FileArchive, desc: 'Gộp nhiều file lại làm một', color: '#3b82f6' },
  { id: 'split', name: 'Cắt PDF', icon: Columns, desc: 'Tách 1 file lớn thành nhiều file nhỏ', color: '#10b981' },
  { id: 'delete-pages', name: 'Xóa trang PDF', icon: Trash2, desc: 'Xóa đi những trang không cần thiết', color: '#ef4444' },
  { id: 'rotate', name: 'Xoay PDF', icon: RotateCw, desc: 'Xoay lại các trang bị ngược', color: '#f59e0b' },
  { id: 'number-pages', name: 'Đánh số trang', icon: FileDigit, desc: 'Chèn số trang vào góc', color: '#8b5cf6' },
  { id: 'img-to-pdf', name: 'Ảnh sang PDF', icon: ImageIcon, desc: 'Nối nhiều ảnh thành 1 file PDF', color: '#14b8a6' }
];

export default function ToolGrid() {
  return (
    <div className={styles.grid}>
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link href={`/tool/${tool.id}`} key={tool.id} className={styles.card}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
              <Icon size={32} />
            </div>
            <h3>{tool.name}</h3>
            <p>{tool.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}
