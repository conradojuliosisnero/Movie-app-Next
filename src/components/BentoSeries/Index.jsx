"use client";
import Image from "next/image";
import "./bento.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BentoSeries({ data, name }) {
  const [categoria, setCategoria] = useState([]);

  const result = data.slice(0, 5);
  const router = useRouter();

  useEffect(() => {
    const getCategoria = async () => {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const res = await fetch("/api/series/gender", OPTIONS);
        const { genres } = await res.json();
        setCategoria(genres);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoria();
  }, []);

  const filterGenderSerie = (genreIds) => {
    const matchedGenres = categoria
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name);

    return matchedGenres.join(" | ");
  };

  return (
    <div className="bento-container">
      <h1 className="bento-titulo">{name} Destacadas</h1>
      <div className="bento-grid">
        {result?.map((serie, index) => (
          <div key={index} className={`serie-card ${serie.tipo}`}>
            <Image
              src={`https://image.tmdb.org/t/p/original${serie.poster_path}`}
              alt={serie.original_name}
              width={100}
              height={100}
              className="serie-imagen"
              onClick={() => router.push(`/serie-details/${serie.id}`)}
            />
            <div className="serie-info">
              <a className="serie-titulo" href={`/serie-details/${serie.id}`}>
                {serie.name}
              </a>
              <p className="serie-genero">
                {filterGenderSerie(serie.genre_ids)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
