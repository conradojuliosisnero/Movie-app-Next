import React from "react";
import styles from "./watch.module.css";
import Image from "next/image";
import GetWatch from "../../services/Watch/GetWatch";
import { useState, useEffect } from "react";

export default function Watch({ id }) {
  const [watch, setWatch] = useState([]);

  useEffect(() => {
    const getWatch = async () => {
      const response = await GetWatch(id, setWatch);
    };
    getWatch();
  }, []);

  if (!watch || watch.length === 0) {
    return (
      <span className={styles.nullWatch}>Sin Plataforma de Streaming  :/</span>
    ); // No renderizar nada si no hay datos en watch.results
  }

  return (
    <div className={styles.BoxWatch}>
      <div className={styles.WatchTitle}>
        <span>Ver en </span>
      </div>
      <div className={styles.cards}>
        {watch?.map((icon) => (
          <div key={icon.provider_id} className={styles.cardWatch}>
            <span key={icon.provider_id} className={styles.cardWatchTitle}>
              {icon.provider_name}
            </span>
            <Image
              className={styles.iconWatch}
              src={`https://image.tmdb.org/t/p/w500/${icon.logo_path}`}
              width={70}
              height={70}
              alt={""}
              priority={false}
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
}