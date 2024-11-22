"use client";
import Image from "next/image";
import "./bento.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BentoMovies({ data, name }) {
  const [categoria, setCategoria] = useState([]);

  let result = data.slice(0, 6);
  const router = useRouter();

  useEffect(() => {
    const getCategoria = async () => {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      };
      try {
        const res = await fetch("/api/movies/gender", OPTIONS);
        const { genres } = await res.json();
        setCategoria(genres);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoria();
  }, []);

  const filterGenderMovie = (genreIds) => {
    const matchedGenres = categoria
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name);

    return matchedGenres.join(" | ");
  };

  return (
    <div className="bento-container">
      <h1 className="bento-titulo">{name} Destacadas</h1>
      <div className="bento-grid">
        {result?.map((pelicula, index) => (
          <div key={index} className={`pelicula-card`}>
            <Image
              src={`https://image.tmdb.org/t/p/original${pelicula.poster_path}`}
              alt={pelicula.original_title}
              width={100}
              height={100}
              className="pelicula-imagen"
              onClick={() => router.push(`/movie-details/${pelicula.id}`)}
            />
            <div className="pelicula-info">
              <a
                className="pelicula-titulo"
                href={`/movie-details/${pelicula.id}`}
              >
                {pelicula.original_title}
              </a>
              <p className="pelicula-genero">
                {filterGenderMovie(pelicula.genre_ids)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
