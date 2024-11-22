"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Button from "../Buttons/Button";
import Container from "@/components/LoadingContainer/Container";
import { container, item } from "./animation";
import Error from "@/components/Error/Error";
import "./encines.scss";

const MediaCardDynamic = dynamic(() => import("./MediaCard/MediaCard"));

export default function Now() {
  const [nowMovies, setNowMovies] = useState([]);
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
    const getMovies = async () => {
      setLoading(true);
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      };
      try {
        const response = await fetch(`/api/movies/now?page=${nextPage}`, OPTIONS);
        const data = await response.json();
        if (response.status !== 200) {
          throw new Error("Error al obtener los datos");
        }
        setNowMovies(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setNowMovies([]);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
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
      <div className="Now_title">
        <h3>En Cines</h3>
      </div>
      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {nowMovies?.results?.map((movie) => (
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
