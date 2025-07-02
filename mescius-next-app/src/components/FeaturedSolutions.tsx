// src/components/FeaturedSolutions.tsx
import Link from 'next/link';
import blueprintsData from '@/data/blueprints.json';
import BlueprintCard from './BlueprintCard';
import styles from './FeaturedSolutions.module.css';
import type { Blueprint } from '@/lib/types';

const typedBlueprintsData: Blueprint[] = blueprintsData;

export default function FeaturedSolutions() {
  const featuredBlueprints = typedBlueprintsData.slice(0, 3);

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Popular Solution Blueprints</h2>
          <p>Start with our most common guides for solving complex development challenges.</p>
        </div>

        {/* The grid now wraps BOTH the cards and the button */}
        <div className={styles.grid}>
          {featuredBlueprints.map((blueprint) => (
            <BlueprintCard
              key={blueprint.id}
              id={blueprint.id}
              href={blueprint.href}
              product={blueprint.product}
              industry={blueprint.industry}
              title={blueprint.title}
              excerpt={blueprint.excerpt}
              frameworks={blueprint.frameworks}
            />
          ))}

          {/* The button container is now the LAST item INSIDE the grid */}
          <div className={styles.ctaContainer}>
            {/* Use the secondary button style for better visual hierarchy */}
            <Link href="/solutions" className="btn btnSecondary">
              View All Solutions →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}