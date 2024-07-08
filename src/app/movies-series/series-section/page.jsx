"use client";
import React from "react";
import LayoutMovieSection from "../Layout";
import "../../../components/MediaCard/postercard.scss";
import { useState, useEffect } from "react";
import Button from "../../../components/Buttons/Button";
import getSeries from "../../../services/Series/GetSeries";
import MediaCard from "../../../components/MediaCard/MediaCard";
import Search from "../../../components/SearchInput/Search";
import GetSearchSeries from "../../../services/SearchSeries/Search";
import GetGenderFilteredSerie from "../../../services/FilterSerie/FilterGenderSerie";
import Container from "../../../components/LoadingContainer/Container";
import Error from "../../../components/Error/Error";
import { AnimatePresence, motion } from "framer-motion";

export default function Series() {
  // estados de data series y busqueda
  const [serieData, setSerieData] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

  // estados de filtros
  const [valueGender, setValueGender] = useState("");

  const [genderFiltered, setGenderFiltered] = useState([]);

  // estados de UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageSerie, setNext] = useState(() => {
    const savedPage = sessionStorage.getItem("currentPageSerie");
    return savedPage ? Number(savedPage) : 1;
  });

  useEffect(() => {
    const SearchSeries = async () => {
      try {
        // ranking popular de series
        const dataSerie = getSeries(setSerieData, nextPageSerie);
        // busqueda de series
        const dataSearch = GetSearchSeries(setDataSearch, search);
        // filtro de series
        const filteredData = await GetGenderFilteredSerie(
          setGenderFiltered,
          nextPageSerie,
          valueGender
        );
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    SearchSeries();
  }, [nextPageSerie, search, valueGender]);

  useEffect(() => {
    sessionStorage.setItem("currentPageSerie", nextPageSerie.toString());
  }, [nextPageSerie]);

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  // busqueda de paginas --> + 1
  const handlerNextMovie = () => {
    setNext(nextPageSerie + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPageSerie - 1);
  };

  // atrapa el valor de search y lo setea en el estado
  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  // Función de búsqueda de películas

  let result = [];
  if (!search && !valueGender) {
    // Si no hay término de búsqueda ni género seleccionado, mostrar todas las películas
    result = serieData;
  } else if (!search && valueGender) {
    // Si no hay término de búsqueda pero hay un género seleccionado, mostrar películas filtradas por género
    result = genderFiltered.results;
  } else if (search && !valueGender) {
    // Si hay un término de búsqueda pero no hay género seleccionado, mostrar resultados de búsqueda
    result = dataSearch.results.filter((serie) =>
      serie.name.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    // Si hay término de búsqueda y también un género seleccionado, aplicar ambos filtros
    result = dataSearch.results.filter(
      (serie) =>
        serie.name.toLowerCase().includes(search.toLowerCase()) &&
        serie.genre_ids.includes(valueGender)
    );
  }

  const handleButtonClick = (id, value) => {
    setValueGender(id);
  };

  const handlerCloseSearch = () => {
    setSearch("");
  };

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
      {loading ? (
        <Container />
      ) : (
          <motion.div
            className="contenedor"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {result
              ? result?.map((serie) => (
                  <MediaCard data={serie} key={serie.id} />
                ))
              : ""}
            {nextPageSerie == 1 ? (
              <></>
            ) : (
              <Button funtionPage={handlerPrevMovie} />
            )}
            <Button isNext funtionPage={handlerNextMovie} />
          </motion.div>
      )}
    </LayoutMovieSection>
  );
}
