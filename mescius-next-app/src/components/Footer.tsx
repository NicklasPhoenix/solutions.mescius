// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Logo and Info */}
          <div className={styles.aboutColumn}>
            <Image
              src="https://cdn.mescius.io/umb/media/pujnxfci/mescuis-logo-horiz.svg"
              alt="Mescius Logo"
              width={150}
              height={36}
              className={styles.footerLogo}
            />
            <p>© 2025 Mescius, Inc. All Rights Reserved.</p>
            <p>All product and company names herein may be trademarks of their respective owners.</p>
          </div>

          {/* Column 2: Company Links */}
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/media-center">Media Center</Link>
            <Link href="/legal">Legal</Link>
          </div>

          {/* Column 3: Follow Us */}
          <div className={styles.linkColumn}>
            <h4>Follow Us</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="X (formerly Twitter)"><i className="fab fa-x-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className={styles.linkColumn}>
            <h4>Get The Latest News</h4>
            <p>Stay up to date with blogs, eBooks, events, and whitepapers.</p>
            <button className={styles.subscribeButton}>SUBSCRIBE</button>
          </div>
        </div>
      </div>
    </footer>
  );
}