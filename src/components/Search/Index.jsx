"use client";
import { useState, useEffect } from "react";
import Button from "@/components/Buttons/Button";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Search from "@/components/SearchInput/Search";
import "./movies.scss";
import { useSelector } from "react-redux";
import { container, item } from "./animation";

const MediaCardDynamic = dynamic(
  () => import("@/components/MediaCard/MediaCard"),
  {
    loading: () => <Container />,
  }
);

export default function SearchPage() {
  const [movieData, setMovieData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [genderFiltered, setGenderFiltered] = useState([]);
  const [valueGender, setValueGender] = useState("");
  const [error, setError] = useState(null);
  const [nextPage, setNext] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem("currentPage");
      return savedPage ? Number(savedPage) : 1;
    }
    return 1;
  });

  useEffect(() => {
    const getDataMovie = async () => {
      try {
        // ranking popular de peliculas
        const response = await fetch(`/api/movies?page=${nextPage}`);
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        setError(error);
      }
    };

    getDataMovie();
  }, [nextPage]);

  useEffect(() => {
    const getGender = async () => {
      try {
        const response = await fetch(
          `/api/movies/filtergender?page=${nextPage}&valueGender=${valueGender}`
        );
        const data = await response.json();
        setGenderFiltered(data);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    getGender();
  }, [valueGender, nextPage]);

  useEffect(() => {
    sessionStorage.setItem("currentPage", nextPage.toString());
  }, [nextPage]);

  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  const handleButtonClick = (id) => {
    setValueGender(id);
  };

  // redux
  const movieSearch = useSelector((state) => state.searchMovie.search);
  // console.log("movieSearch", movieSearch);
  // console.log("result", result);

  let result = [];
  if (!movieSearch && !valueGender) {
    // Si no hay término de búsqueda ni género seleccionado, mostrar todas las películas
    result = movieData.results
  } else if (!movieSearch && valueGender) {
    // Si no hay término de búsqueda pero hay un género seleccionado, mostrar películas filtradas por género
    result = genderFiltered.results;
  } else if (movieSearch && !valueGender) {
    // Si hay un término de búsqueda pero no hay género seleccionado, mostrar resultados de búsqueda
    result = movieSearch?.results?.filter((movie) => movie.title.toLowerCase());
  } else {
    // Si hay término de búsqueda y también un género seleccionado, aplicar ambos filtros
    result = dataSearch.results
      .filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((movie) => movie.genre_ids.includes(valueGender));
  }

  return (
    <>
      {/* buscador  */}
      <div className="searcherMovie">
        <Search filter={handleButtonClick} />
      </div>

      <div className="movie_title">
        <h5>Busqueda</h5>
      </div>

      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {result?.map((movie) => (
          <motion.div variants={item}>
            <MediaCardDynamic data={movie} key={movie.id} />
          </motion.div>
        ))}
        {nextPage == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </motion.div>
    </>
  );
}


