import CastingMovie from "../../services/CastingMovies/CastingMovie";
import SerieCasting from "../../services/CastingSerie/CastingSerie";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import male from "../../../public/male.svg";
import female from '../../../public/female.svg'

import "./casting.css";

export default function Casting({ id }) {
  const [castingMovie, setCasting] = useState({});
  const [castingSerie, setCastingSerie] = useState({});
  const [result, setResult] = useState([]);

  const pathname = useParams();

  useEffect(() => {
    const fetchCasting = async () => {
      let resultdata = [];
      if (pathname.id == id) {
        const resultMovie = await CastingMovie(id);
        resultdata = resultMovie;
        setCasting(resultdata);
      } else {
        const resultSerie = await SerieCasting(id);
        resultdata = resultSerie;
        setCastingSerie(resultdata);
      }
      setResult(resultdata);
    };

    fetchCasting();
  }, [id]);

  return (
    <div className="slider_container">
      <h2 className="title__casting">Elenco</h2>
      <div className="casting">
        {result?.cast?.map((actor) => (
          <div className="card" key={actor.id}>
            <div className="img__casting">
              <Image
                className="img"
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                    : actor.gender === 1
                    ? female
                    : male
                }
                alt={actor.name}
                loading="lazy"
                quality={30}
                decoding="async"
                width={100}
                height={100}
              ></Image>
            </div>
            <div className="name__casting">
              <span className="name__actor">{actor.name}</span>
              <span className="chararter__name">{actor.character}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
