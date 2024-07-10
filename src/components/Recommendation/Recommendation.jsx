import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./recommendation.module.css";
import GetRecommendation from "../../services/RecommendationMovie/MovieRC";
import GetRecomendationSerie from "../../services/RecommendationSerie/SerieRC";
import defaul from "../../../public/image-no-found.svg";
import Link from "next/link";
import Image from "next/image";

export default function Recommendation({ id }) {
  const [result, setResult] = useState([]);

  // params
  const params = useParams();

  useEffect(() => {
    const fetchRecomendation = async () => {
      let resultdata = [];
      if (params.id == id) {
        const data = await GetRecommendation(id);
        resultdata = data;
        setResult(resultdata);
      } else {
        const data = await GetRecomendationSerie(id);
        resultdata = data;
        setResult(resultdata);
      }
      setResult(resultdata);
    };

    fetchRecomendation();
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
                      ? `/movie/${recomendation.id}`
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
                    alt={recomendation.title}
                    loading="lazy"
                    width={100}
                    height={100}
                  ></Image>
                </Link>
              </div>
              <div className={`${styles["name__casting"]}`}>
                <span className={`${styles["name__actor"]}`}>{recomendation.title}</span>
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
