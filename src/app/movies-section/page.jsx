"use client";
import React from "react";
import MovieCard from "../../components/PosterCard/MovieCard";
import { useState, useEffect } from "react";
import "../../components/PosterCard/postercard.scss";
import getMovies from "../../services/TMDB/GetMovies";
import Loading from "../../components/Loader/Loading";
import Button from "../../components/Buttons/Button";

export default function Movies() {
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNext] = useState(1);

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

  const handlerNextMovie = (e) => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = (e) => {
    setNext(nextPage - 1);
    if (nextPage <= 1) {
      setNext(1);
    }
  };

  return (
    <main className="contenedor">
      {loading ? (
        <Loading />
      ) : (
        movieData.results?.map((movie) => <MovieCard datamovie={movie} />)
      )}
      {nextPage == 1 ? <></> : <Button funtionPage={handlerPrevMovie} />}
      <Button isNext funtionPage={handlerNextMovie} />
    </main>
  );
}
