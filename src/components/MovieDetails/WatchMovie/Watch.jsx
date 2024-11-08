"use client";
import styles from "./watch.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Watch({ id }) {
  const [watch, setWatch] = useState([]);
  const [watchSerie, setWatchSerie] = useState([]);
  const params = useParams();

  useEffect(() => {
    const getWatch = async () => {
      if (params.id == id) {
        try {
          const response = await fetch(`/api/movies/watch?id=${id}`);
          const data = await response.json();
          setWatch(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await fetch(`/api/series/watch?id=${id}`);
          const data = await response.json();
          setWatchSerie(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    getWatch();
  }, [id]);


  return (
    <div className={styles.BoxWatch}>
      <div className={styles.WatchTitle}>
        <span>Ver en </span>
      </div>
      <div className={styles.cards}>
        {watch.rent && watch.rent.length > 0 ? (
          watch.rent.map((icon) => (
            <div key={icon.provider_id} className={styles.cardWatch}>
              <span key={icon.provider_id} className={styles.cardWatchTitle}>
                {icon.provider_name}
              </span>
              <Image
                className={styles.iconWatch}
                src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
                width={70}
                height={70}
                alt={icon.provider_name}
                priority={false}
              ></Image>
            </div>
          ))
        ) : watchSerie && watchSerie.length > 0 ? (
          watchSerie.map((icon) => (
            <div key={icon.provider_id} className={styles.cardWatch}>
              <span key={icon.provider_id} className={styles.cardWatchTitle}>
                {icon.provider_name}
              </span>
              <Image
                className={styles.iconWatch}
                src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
                width={70}
                height={70}
                alt={icon.provider_name}
                priority={false}
              ></Image>
            </div>
          ))
        ) : (
          <span className={styles.nullWatch}>
            Sin plataformas disponibles :/
          </span>
        )}
      </div>
    </div>
  );
}
