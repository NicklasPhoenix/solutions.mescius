// src/components/BlueprintCard.tsx
import Link from 'next/link';
import styles from './BlueprintCard.module.css';
import type { Blueprint } from '@/lib/types';

const frameworkMap: { [key: string]: { icon: string; name: string } } = {
  react: { icon: 'fa-brands fa-react', name: 'React' },
  angular: { icon: 'fa-brands fa-angular', name: 'Angular' },
  vue: { icon: 'fa-brands fa-vuejs', name: 'Vue' },
  winforms: { icon: 'fa-brands fa-windows', name: 'WinForms' },
  wpf: { icon: 'fa-brands fa-windows', name: 'WPF' },
  dotnet: { icon: 'fa-solid fa-microchip', name: '.NET' },
};

export default function BlueprintCard({ href, product, industry, title, excerpt, frameworks }: Blueprint) {
  return (
    <Link href={href} className={`${styles.card} ${styles[product] || ''}`}>
      <div>
        <p className={styles.tag}>{industry}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
      </div>
      <div className={styles.footer}>
        <div className={styles.frameworks}>
          {frameworks.map((fwKey) => {
            const framework = frameworkMap[fwKey];
            if (!framework) return null;

            return (
              // Each tag now contains an icon and a visible name
              <div key={fwKey} className={styles.frameworkTag}>
                <i className={framework.icon}></i>
                <span className={styles.frameworkName}>{framework.name}</span>
              </div>
            );
          })}
        </div>
        <span className={styles.link}>
          View Blueprint <span>→</span>
        </span>
      </div>
    </Link>
  );
}