import styles from "./movidetails.module.css";
import Shimmer from "./Shimmer";

const LoadingSkeleton = () => {
  return (
    <section className={styles.sectionMovie}>
      <div className={styles.container}>
        <div className={styles.backgroundDetails}>
          <div className={styles.backgroundDetailsImg}>
            <Shimmer width="100%" height="100%" />
          </div>
        </div>
        <div className={styles.overview}>
          <div className={styles.titleMovie}>
            <Shimmer width="50%" height="24px" />
          </div>
          <div className={styles.year_generes}>
            <Shimmer width="100px" height="20px" />
            <Shimmer width="150px" height="20px" />
            <div className={styles.genero}>
              <Shimmer width="80px" height="20px" />
              <Shimmer width="80px" height="20px" />
              <Shimmer width="80px" height="20px" />
            </div>
            <div className={styles.stats}>
              <div>
                <Shimmer width="100px" height="40px" />
              </div>
            </div>
            <div className={styles.BoxModal}>
              <Shimmer width="120px" height="40px" />
            </div>
            <div>
              <Shimmer width="120px" height="40px" />
            </div>
          </div>
          <Shimmer width="100%" height="100px" />
        </div>
      </div>
      <div className={styles.Watch}>
        <Shimmer width="100%" height="60px" />
      </div>
      <div className={styles.CastingBox}>
        <Shimmer width="100%" height="60px" />
      </div>
      <Shimmer width="100%" height="60px" />
    </section>
  );
};

export default LoadingSkeleton;
