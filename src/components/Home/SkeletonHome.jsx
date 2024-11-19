
import styles from "./skeleton.module.css";

const SkeletonHome = () => {
  return (
    <main className={styles.name}>
      {/* WELCOME HOME SKELETON */}
      <div className={styles.skeletonWelcome}></div>

      {/* POPULAR MOVIES SKELETON */}
      <div className={styles.topMoviesContainer}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonGrid}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className={styles.skeletonCard}></div>
            ))}
        </div>
      </div>

      {/* AUTOPLAY SLIDER SKELETON */}
      <div className={styles.topMoviesContainer}>
        <div className={styles.skeletonSlider}></div>
      </div>

      {/* SERIES SKELETON */}
      <div className={styles.topMoviesContainer}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonGrid}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className={styles.skeletonCard}></div>
            ))}
        </div>
      </div>

      {/* POPULAR SERIES SKELETON */}
      <div className={styles.topSeriesContainer}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonGrid}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className={styles.skeletonCard}></div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default SkeletonHome;
