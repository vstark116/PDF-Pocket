import styles from './page.module.css';
import HeroSearch from '@/components/HeroSearch';
import ToolGrid from '@/components/ToolGrid';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1>PDF Pocket</h1>
        <p>Mọi công cụ PDF bạn cần, ngay trong tầm tay</p>
        <HeroSearch />
      </header>
      <ToolGrid />
    </main>
  );
}
