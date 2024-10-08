"use client";
import "@/components/MediaCard/postercard.scss";
import LayoutMovieSection from "@/layouts/Layout";
import Button from "@/components/Buttons/Button";
import Search from "@/components/SearchInput/Search";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem("currentPageSerie");
      return savedPage ? Number(savedPage) : 1;
    }
    return 1;
  });

  useEffect(() => {
    const getSeries = async () => {
      try {
        const response = await fetch(`/api/series?page=${nextPageSerie}`);
        const data = await response.json();
        setSerieData(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getSeries();
  }, [nextPageSerie]);

  useEffect(() => {
    const getSearch = async () => {
      try {
        const response = await fetch(`/api/series/searcher?value=${search}`);
        const data = await response.json();
        setDataSearch(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getSearch();
  }, [search]);

  useEffect(() => {
    const getGenderFiltered = async () => {
      try {
        const response = await fetch(
          `/api/series/filtergender?value=${valueGender}&page=${nextPageSerie}`
        );
        const data = await response.json();
        setGenderFiltered(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getGenderFiltered();
  }, [valueGender,nextPageSerie]);

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

  const handleButtonClick = (id) => {
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

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // media card dynamic
    const MediaCardDynamic = dynamic(
      () => import("@/components/MediaCard/MediaCard"),
      {
        loading: () => <Container />,
        ssr: false,
      }
    );
  
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

      <div className="series_title">
        <h3>Series</h3>
      </div>

      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {result?.map((serie) => (
          <motion.div variants={item} key={serie.id}>
            <MediaCardDynamic data={serie} />
          </motion.div>
        ))}
        {nextPageSerie == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </motion.div>
    </LayoutMovieSection>
  );
}
