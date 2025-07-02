// src/components/LogoStrip.tsx
import Image from 'next/image';
import styles from './LogoStrip.module.css';

// Use the external URLs for the logos
const logos = [
  { src: 'https://classmethod.de/images/SVG/logo_black_2023.svg', alt: 'Classmethod' },
  { src: 'https://www.calsoft.com/wp-content/uploads/2020/04/calsoft-logo-flat-2.png', alt: 'Calsoft' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', alt: 'Microsoft' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg', alt: 'Tesla' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg', alt: 'Siemens' },
];

export default function LogoStrip() {
  // The rest of the component remains exactly the same...
  return (
    <section className={styles.logoStrip}>
      <div className={styles.container}>
        <p className={styles.heading}>TRUSTED BY DEVELOPERS AT LEADING COMPANIES</p>
        <div className={styles.logosContainer}>
          {logos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={40}
              className={styles.logoImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}