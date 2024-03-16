"use client";
import { useState, useEffect } from "react";
import "./postercard.scss";
import getMovies from "../../services/TMDB/GetMovies";
import Loading from "../Loader/Loading";
import Link from "next/link";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const MovieCard = () => {
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNext] = useState(1);
  const Next = "Next";
  const Prev = "Prev";

  const handlerNextMovie = (e) => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = (e) => {
    setNext(nextPage - 1);
    if (nextPage <= 1) {
      setNext(1);
    }
  };

  useEffect(() => {
    const getDataMovie = async () => {
      try {
        const data = await getMovies(setMovieData, nextPage);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getDataMovie();
  }, [nextPage]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="contenedor">
        {loading ? (
          <div className="contend-loader">
            <Loading />
          </div>
        ) : (
          movieData.results?.map((movie) => (
            <div className="pelicula" key={movie.id}>
              {/* img  */}
              <div className="contend__poster">
                <img
                  className="poster"
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                />
                {/* card hover  */}
                <div className="contend__hover">
                  <Link href="/moviesInfo/" className="movie_link">
                    More Info
                  </Link>
                </div>
              </div>
              <h3 className="titulo">
                <span>{movie.title}</span>
              </h3>
              <div className="contend__overview" id="contend__overview">
                <div className="regresar__overview">
                  <i className="fa-solid fa-x"></i>
                </div>
                {/* Aquí puedes incluir más elementos HTML según necesites */}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="ButtonPrev">
        {nextPage == 1 ? (
          <></>
        ) : (
          <button onClick={handlerPrevMovie}>
            <GrPrevious />
          </button>
        )}
      </div>
      <div className="ButtonNext">
        <button className="" onClick={handlerNextMovie}>
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
