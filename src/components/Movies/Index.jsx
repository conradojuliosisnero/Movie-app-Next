"use client";
// import Search from "@/components/SearchInput/Search";
import { useState, useEffect } from "react";
import Button from "@/components/Buttons/Button";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import dynamic from "next/dynamic";
import { container, item } from "./animation";
import { motion } from "framer-motion";
import "./movies.scss";

const MediaCardDynamic = dynamic(
  () => import("./MediaCard/MediaCard")
);

const Movies = () => {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      try {
        const response = await fetch(`/api/movies?page=${nextPage}`);
        const { results } = await response.json();
        setMovieData(results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setMovieData([]);
      }finally{
        setLoading(false);
      }
    };

    getDataMovie();
  }, [nextPage]);

  useEffect(() => {
    sessionStorage.setItem("currentPage", nextPage.toString());
  }, [nextPage]);

  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  if (loading) { 
    return <Container />;
  }

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  return (
    <>
      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {movieData?.map((movie) => (
          <motion.div variants={item}>
            <MediaCardDynamic data={movie} key={movie.id} />
          </motion.div>
        ))}
        {nextPage == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </motion.div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Movies));
