"use client";
import "./series.scss";
import LayoutMovieSection from "@/layouts/Layout";
import Button from "@/components/Buttons/Button";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { container, item } from "./animation";

const MediaCardDynamic = dynamic(() => import("./MediaCard/MediaCard"));

export default function Series() {
  const [serieData, setSerieData] = useState([]);
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
      setLoading(true);
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const response = await fetch(
          `/api/series?page=${nextPageSerie}`,
          OPTIONS
        );
        const data = await response.json();
        setSerieData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setSerieData([]);
      } finally {
        setLoading(false);
      }
    };
    getSeries();
  }, [nextPageSerie]);

  useEffect(() => {
    sessionStorage.setItem("currentPageSerie", nextPageSerie.toString());
  }, [nextPageSerie]);

  const handlerNextMovie = () => {
    setNext(nextPageSerie + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPageSerie - 1);
  };

  if (loading) {
    return <Container />;
  }

  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  return (
    <LayoutMovieSection>
      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {serieData?.map((serie) => (
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
