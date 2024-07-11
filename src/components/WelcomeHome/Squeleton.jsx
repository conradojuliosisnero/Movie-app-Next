import styles from './welcome.module.css';

const Squeleton = () => {
    return (
        <div>
            <div className={styles.skeleton}>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
            </div>
        </div>
    );
};

export default Squeleton;
