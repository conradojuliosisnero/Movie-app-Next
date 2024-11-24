import React from "react";
import styles from "./watch.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function WatchSerie({ id }) {
  const [watch, setWatch] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWatch = async () => {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const response = await fetch(`/api/series/watch?id=${id}`, OPTIONS);
        const data = await response.json();
        setWatch(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        setError("Error al obtener las plataformas de renta");
      }
    };
    getWatch();
  }, [id]);

  if (!watch || watch.length === 0 || error) {
    return (
      <span className={styles.nullWatch}>No hay Plataformas de renta</span>
    );
  }

  return (
    <div className={styles.BoxWatch}>
      <div className={styles.WatchTitle}>
        <span>Ver en </span>
      </div>
      <div className={styles.cards}>
        {watch?.map((icon, index) => (
          <div key={index} className={styles.cardWatch}>
            <span key={icon.provider_id} className={styles.cardWatchTitle}>
              {icon.provider_name}
            </span>
            <Image
              className={styles.iconWatch}
              src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
              width={70}
              height={70}
              alt={"icon-provider-watch"}
              priority={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// <div key={icon.provider_id}>
//   <span>{icon.provider_name}</span>
//   <Image
//     src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
//     width={100}
//     height={100}
//     alt={""}
//     priority={false}
//   ></Image>
// </div>
