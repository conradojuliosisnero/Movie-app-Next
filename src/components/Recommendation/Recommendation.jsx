import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./recommendation.module.css";
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
    <div className="slider_container">
      <h2 className="title__casting">Recomendaciones</h2>
      <div className="casting">
        {result.results == undefined || null ? (
          <div className="no-recomendations">
            <h3>sin recomendaciones</h3>
          </div>
        ) : (
          result.results.slice(0, 5).map((recomendation) => (
            <div className="card" key={recomendation.id}>
              <div className="img__casting">
                <Link
                  href={
                    params.id == id
                      ? `/movie/${recomendation.id}`
                      : `/serie/${recomendation.id}`
                  }
                >
                  <Image
                    className="img"
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
              <div className="name__casting">
                <span className="name__actor">{recomendation.title}</span>
                <span className="chararter__name">
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
