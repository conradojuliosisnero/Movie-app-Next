"use client";
import styles from "./recommendation.module.css";
import defaul from "../../../../public/image-no-found.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Recommendation = ({ id }) => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // params
  const params = useParams();

  useEffect(() => {
    const getMovieRecomendation = async () => {
      try {
        const response = await fetch(`/api/movies/recomendation?id=${id}`);
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setError("Error al obtener las recomendaciones");
      }
    };

    getMovieRecomendation();
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
                <Link
                  href={
                    params.id == id
                      ? `/movie-details/${recomendation.id}`
                      : `/serie/${recomendation.id}`
                  }
                >
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

export default dynamic(() => Promise.resolve(Recommendation));