import styles from "./season.module.css";
import Chapter from "../Chapter/Chapter";
import Image from "next/image";

export default function Season({ detailSeason }) {
  console.log(detailSeason);
  return (
    <div className={styles.seasonContainer}>
      {detailSeason.map((season) => (
        <div className={styles.seasonContend}>
          <span className={styles.tempNumber}>
            Temp: {season.season_number}
          </span>
          <div className={styles.seasonPoster}>
            <Image
              className={styles.imgTemp}
              src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
              alt={season.name}
              priority={false}
              quality={30}
              width={120}
              height={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
