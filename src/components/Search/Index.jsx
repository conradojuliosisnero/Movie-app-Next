"use client";
import { useState, useEffect } from "react";
// import Button from "@/components/Buttons/Button";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Search from "@/components/SearchInput/Search";
import { useSelector } from "react-redux";
import { container, item } from "./animation";
import "./movies.scss";

const MediaCardDynamic = dynamic(
  () => import("./MediaCard/MediaCard"),
  {
    loading: () => <Container />,
  }
);

export default function SearchPage() {
  const [resultSearch, setResultSearch] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTranfingAll = async () => {
            const OPTIONS = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              include: "credentials",
            };
      try {
        const response = await fetch(`/api/tranding`, OPTIONS);
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
  }, []);

  // redux
  const movieSearchSlice = useSelector((state) => state.searchMovie.search);

  let result = [];

  if (!movieSearchSlice.length > 0) {
    result = resultSearch.slice(0, 10);
  } else if (movieSearchSlice.length > 0) {
    result = movieSearchSlice;  
  }

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  return (
    <>
      {/* buscador  */}
      <div className="searcherMovie">
        <Search />
      </div>
      <div className="contend__tittle">
        <h5 className="titulo">Tendencia</h5>
      </div>
      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {result?.map((movie) => (
          <motion.div variants={item} key={movie.id}>
            <MediaCardDynamic data={movie} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
