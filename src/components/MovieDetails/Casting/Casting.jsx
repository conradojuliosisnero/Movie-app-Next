"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import male from "../../../../public/male.svg";
import female from "../../../../public/female.svg";
import "./casting.css";
import dynamic from "next/dynamic";

const Casting = ({ id }) => {
  const [castingMovie, setCasting] = useState({});
  const [error, setError] = useState(false);

  const route = useRouter();

  useEffect(() => {
    const getMovieCasting = async () => {
      try {
        const response = await fetch(`/api/movies/elenco?id=${id}`);
        const data = await response.json();
        setCasting(data);
      } catch (error) {
        setError(error);
      }
    };

    getMovieCasting();
  }, [id]);

  return (
    <div className="slider_container">
      <h2 className="title__casting">Elenco</h2>
      <div className="casting">
        {castingMovie?.cast?.map((actor) => (
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
                quality={50}
                decoding="async"
                width={100}
                height={100}
                onClick={() => {
                  route.push(`/person/${actor.id}`);
                }}
              />
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

export default dynamic(() => Promise.resolve(Casting));
