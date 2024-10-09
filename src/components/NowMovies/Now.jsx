"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Button from "../Buttons/Button";
import Container from "@/components/LoadingContainer/Container";

export default function Now() {
  const [nowMovies, setNowMovies] = useState([]);
  const [nextPage, setNext] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem("currentPage");
      return savedPage ? Number(savedPage) : 1;
    }
    return 1;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      const OPTIONS = {
        method: "GET",
        next: { tags: ["now"] },
      }
      try {
        const response = await fetch(`/api/movies/now?page=${nextPage}`);
        const data = await response.json();
        setNowMovies(data);
        setLoading(false);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [nextPage]);

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

  const MediaCardDynamic = dynamic(
    () => import("@/components/MediaCard/MediaCard"),
    {
      loading: () => <Container />,
      ssr: false,
    }
  );

  return (
    <>
      <div className="Now_title">
        <h3>En Cine</h3>
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
