'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TOOLS } from './ToolGrid';
import styles from './HeroSearch.module.css';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) || 
    t.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <Search className={styles.icon} size={24} />
        <input 
          type="text"
          placeholder="Bạn cần làm gì với PDF? (VD: Nén, Cắt, Ghép...)"
          className={styles.input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(query.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>
      
      {isOpen && filteredTools.length > 0 && (
        <div className={styles.dropdown}>
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id} 
                className={styles.resultItem}
                onClick={() => router.push(`/tool/${tool.id}`)}
              >
                <div className={styles.resultIcon} style={{ color: tool.color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className={styles.resultName}>{tool.name}</div>
                  <div className={styles.resultDesc}>{tool.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
