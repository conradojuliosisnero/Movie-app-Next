"use client";
import React from "react";
import { useState, useEffect } from "react";
import "../../../components/MediaCard/postercard.scss";
import getMovies from "../../../services/TMDB/GetMovies";
import Button from "../../../components/Buttons/Button";
import LayoutMovieSection from "../Layout";
import MediaCard from "../../../components/MediaCard/MediaCard";
import Search from "../../../components/SearchInput/Search";
import GetSearch from "../../../services/SearchMovie/Search";
import GetGenderFiltered from "../../../services/FilterMovie/FilterGender";
import Container from "../../../components/LoadingContainer/Container";
import Error from "../../../components/Error/Error";
import { motion } from "framer-motion";

export default function Movies() {
  // estados de data y busqueda
  const [movieData, setMovieData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setSearch] = useState("");

  // estados de filtros
  const [genderFiltered, setGenderFiltered] = useState([]);
  const [valueGender, setValueGender] = useState("");

  // estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNext] = useState(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    return savedPage ? Number(savedPage) : 1;
  });

  // cada que el nextpage cambia busca una nueva pagina
  useEffect(() => {
    const getDataMovie = async () => {
      try {
        // ranking popular de peliculas
        const data = await getMovies(setMovieData, nextPage);
        // busqueda de peliculas
        const dataSearch = await GetSearch(setDataSearch, search);
        // filtro de peliculas
        const filteredData = await GetGenderFiltered(
          setGenderFiltered,
          nextPage,
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

  useEffect(() => {
    sessionStorage.setItem("currentPage", nextPage.toString());
  }, [nextPage]);

  // busqueda de paginas --> + 1
  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  // busqueda de paginas --> - 1
  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  // si hay un error renderiza --> error component
  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  // atrapa el valor de search y lo setea en el estado
  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  // atrapa el valor de uno de los filtros
  const handleButtonClick = (id, value) => {
    setValueGender(id);
  };

  const handlerCloseSearch = () => {
    setSearch("");
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

  //variables de animacion
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <LayoutMovieSection>
      {/* buscador  */}
      <div className="searcher">
        <Search
          funtion={handlerSearch}
          filter={handleButtonClick}
          value={search}
          close={handlerCloseSearch}
        />
      </div>

      {/* contedor de peliculas */}
      {loading ? (
        <Container />
      ) : (
        <motion.div
          className="contenedor"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <Container />
          ) : (
            result?.map((movie) => (
              <motion.div
              variants={item}
              >
                <MediaCard data={movie} key={movie.id} />
              </motion.div>
            ))
          )}
          {nextPage == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
          <Button isNext funtionPage={handlerNextMovie} />
        </motion.div>
      )}
    </LayoutMovieSection>
  );
}
