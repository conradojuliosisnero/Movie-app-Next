"use client";
import React from "react";
import { useState, useEffect } from "react";
import "../../../components/PosterCard/postercard.scss";
import getMovies from "../../../services/TMDB/GetMovies";
import Loading from "../../../components/Loader/Loading";
import Button from "../../../components/Buttons/Button";
import LayoutMovieSection from "../Layout";
import MovieCard from "../../../components/PosterCard/MovieCard";
import Search from "../../../components/SearchInput/Search";
import GetSearch from "../../../services/SearchMovie/Search";
import GetGenderFiltered from "../../../services/FilterGender/FilterGender";

export default function Movies() {
  // estados de data y busqueda
  const [movieData, setMovieData] = useState([]);
  const [nextPage, setNext] = useState(1);
  const [dataSearch, setSetDataSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFiltered, setGenderFiltered] = useState([]);
  const [valueGender, setValueGender] = useState("");

  // estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // cada que el nextpage cambia busca una nueva pagina
  useEffect(() => {
    const getDataMovie = async () => {
      try {
        const data = await getMovies(setMovieData, nextPage);
        const dataSearch = await GetSearch(setSetDataSearch, search);
        const filteredData = await GetGenderFiltered(
          setGenderFiltered,
          valueGender
        );
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getDataMovie();
  }, [nextPage, search, valueGender]);


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
  // atrapa el valor de uno de los filtros
  const handleButtonClick = (id, value) => {
    setValueGender(id);
  };

  // Función de búsqueda de películas
  let result = [];
  if (!search && !valueGender) {
    // Si no hay término de búsqueda ni género seleccionado, mostrar todas las películas
    result = movieData.results;
  } else if (!search && valueGender) {
    // Si no hay término de búsqueda pero hay un género seleccionado, mostrar películas filtradas por género
    result = genderFiltered.results;
  } else if (search && !valueGender) {
    // Si hay un término de búsqueda pero no hay género seleccionado, mostrar resultados de búsqueda
    result = dataSearch.results.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    // Si hay término de búsqueda y también un género seleccionado, aplicar ambos filtros
    result = dataSearch.results
      .filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((movie) => movie.genre_ids.includes(valueGender));
  }
  

  return (
    <LayoutMovieSection loading={loading}>
      {/* buscador  */}
      <div className="searcher">
        <Search funtion={handlerSearch} filter={handleButtonClick} />
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
