"use client"
import styles from "./season.module.css";
import Image from "next/image";
import notFound from "../../../../public/image-no-found.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Season({ detailSeason ,idSeason}) {

  const router = useRouter()


  return (
    <div className={styles.seasonContainer}>
      {detailSeason?.map((season) => (
        <div className={styles.seasonContend}>
          <span className={styles.tempNumber}>
            Temp: {season.season_number}
          </span>
          <div className={styles.seasonPoster}>
            <Image
              className={styles.imgTemp}
              src={
                season.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${season.poster_path}`
                  : notFound
              }
              alt={season.name}
              quality={30}
              width={100}
              height={100}
              // onClick={() => handlerSeason(season.season_number, season.id)}
            />
            <div className="contend__season">
              <Link
                href={`/season/${idSeason}/${season.season_number}/${detailSeason.id}`}
                className="season_link"
              ></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
