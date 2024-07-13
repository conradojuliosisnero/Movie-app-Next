import styles from "./slaider.module.css";

export default function SkeletonSlider() {
    const data = Array.from({ length: 5 }).map((_, index) => index);
    return (
        <div>
            {data.map((item) => (
                <div key={item} className={styles["skeleton-slider"]}>
                    <div className={styles["skeleton-slider__image"]}></div>
                    <div className={styles["skeleton-slider__title"]}></div>
                    <div className={styles["skeleton-slider__description"]}></div>
                </div>
            ))}
        </div>
    );
}
