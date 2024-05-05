"use client";
import React from "react";
import MovieCard from "../../../components/PosterCard/MovieCard";
import { useState, useEffect } from "react";
import "../../../components/PosterCard/postercard.scss";
import getMovies from "../../../services/TMDB/GetMovies";
import Loading from "../../../components/Loader/Loading";
import Button from "../../../components/Buttons/Button";
import LayoutMovieSection from "../Layout";
import Search from "../../../components/SearchInput/Search";
import GetSearch from "../../../services/SearchMovie/Search";

export default function Movies() {
  // estados de data y busqueda
  const [movieData, setMovieData] = useState([]);
  const [nextPage, setNext] = useState(1);
  const [dataSearch, setSetDataSearch] = useState([])
  const [search, setSearch] = useState("");

  // estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // cada que el nextpage cambia busca una nueva pagina
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

    const getSearchMovie = async () => {
      try {
        const dataSearch = await GetSearch(setSetDataSearch, search);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
  
    getDataMovie();
    getSearchMovie();
  }, [nextPage,search]);

  // busqueda de paginas --> + 1
  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  // si hay un error renderiza --> error component
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // atrapa el valor de search y lo setea en el estado
  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  // funcion de busqueda de peliculas
  let result = [];
  if (!search) {
    result = movieData.results;
  } else {
    result = dataSearch.results.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return (
    <LayoutMovieSection loading={loading}>
      {/* buscador  */}
      <div className="searcher">
        <Search funtion={handlerSearch} />
      </div>
      {/* contedor de peliculas */}
      <div className="contenedor">
        {loading ? (
          <Loading />
        ) : (
          result?.map((movie) => <MovieCard datamovie={movie} key={movie.id} />)
        )}
        {nextPage == 1 ? <></> : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </div>
    </LayoutMovieSection>
  );
}
