"use client";
import styles from "./recommendation.module.css";
import defaul from "../../../../public/image-no-found.svg";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Recommendation({ id }) {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSerieRecomendation = async () => {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const response = await fetch(
          `/api/series/recomendation?id=${id}`,
          OPTIONS
        );
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setError("Error al obtener las recomendaciones");
      }
    };
    if (id) {
      getSerieRecomendation();
    }
  }, [id]);

  return (
    <div className={`${styles.slider_container}`}>
      <h2 className={`${styles.title__casting}`}>Recomendaciones</h2>
      <div className={`${styles.casting}`}>
        {result.results == undefined || null ? (
          <div className={`${styles["no-recomendations"]}`}>
            <h3>sin recomendaciones</h3>
          </div>
        ) : (
          result.results.slice(0, 5).map((recomendation) => (
            <div className={`${styles.card}`} key={recomendation.id}>
              <div className={`${styles["img__casting"]}`}>
                <Link href={`/serie-details/${recomendation.id}`}>
                  <Image
                    className={`${styles.img}`}
                    src={
                      recomendation.poster_path
                        ? `https://image.tmdb.org/t/p/original${recomendation.poster_path}`
                        : defaul
                    }
                    alt={
                      recomendation.name
                        ? recomendation.name
                        : recomendation.title
                    }
                    loading="lazy"
                    quality={30}
                    width={100}
                    height={100}
                  ></Image>
                </Link>
              </div>
              <div className={`${styles["name__casting"]}`}>
                <span className={`${styles["name__actor"]}`}>
                  {recomendation.title}
                </span>
                <span className={`${styles["chararter__name"]}`}>
                  {recomendation.character}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
