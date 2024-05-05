import styles from './chapter.module.css'
import Image from 'next/image'

export default function Chapter({ chapter }) {
  return (
    <div className={styles.chapterCard}>
      <div className={styles.contendImage}>
        <Image src={""} alt="" width={100} height={100} />
      </div>
      <span className={styles.chapterNumber}>Episodio</span>
    </div>
  );
}
