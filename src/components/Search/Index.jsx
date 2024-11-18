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
  () => import("./MediaCard/MediaCard"),
  {
    loading: () => <Container />,
  }
);

export default function SearchPage() {
  const [resultSearch, setResultSearch] = useState([]);
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
    const getTranfingAll = async () => {
      try {
        const response = await fetch(`/api/tranding`);
        if (response.status !== 200) {
          throw new Error("Error al obtener los datos");
        }
        const { results } = await response.json();
        setResultSearch(results);
      } catch (error) {
        setError(error);
      }
    };

    getTranfingAll();
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

  const handleButtonClick = (id) => {
    setValueGender(id);
  };

  // redux
  const movieSearchSlice = useSelector((state) => state.searchMovie.search);
  // console.log("movieSearchSlice", movieSearchSlice);
  // console.log("resultSearch", resultSearch);

  // let result = [];
  // if (!movieSearchSlice && !valueGender) {
  //   result = resultSearch;
  // } else if (!movieSearchSlice && valueGender) {
  //   result = genderFiltered.results;
  // } else if (movieSearchSlice && !valueGender) {
  //   result = movieSearchSlice?.results?.filter((movie) => movie.title.toLowerCase());
  // } else {
  //   result = dataSearch.results
  //     .filter((movie) =>
  //       movie.title.toLowerCase().includes(search.toLowerCase())
  //     )
  //     .filter((movie) => movie.genre_ids.includes(valueGender));
  // }

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  return (
    <>
      {/* buscador  */}
      <div className="searcherMovie">
        <Search filter={handleButtonClick} />
      </div>

      <div className="movie_title">
        <h5>En Tendencia</h5>
      </div>

      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {resultSearch?.map((movie) => (
          <motion.div variants={item} key={movie.id}>
            <MediaCardDynamic data={movie} />
          </motion.div>
        ))}
        {nextPage == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </motion.div>
    </>
  );
}
