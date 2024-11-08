"use client";
import { useMovieDetails } from "@/hooks/useDetails";
import styles from "./movidetails.module.css";
import Image from "next/image";
import Image404 from "../../../public/image-no-found.svg";
import { colors, formatDate } from "@/utils/utils";
import dynamic from "next/dynamic";
import LoadingSkeleton from "../Skeleton/Skeleton";
import { Suspense } from "react";

export default function MovieDetails({ id }) {
  // hook for get movie details
  const { details, error, loading } = useMovieDetails(id);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={
              `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${details.backdrop_path}` ||
              Image404
            }
            alt={details.title || details.name || "Movie"}
            width={100}
            height={100}
            layout="responsive"
            quality={50}
          />
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.titleMovie}>
            <span>{details.title || details.name}</span>
          </div>
          {/* details generes  */}
          <div className={styles.year_generes}>
            {details.first_air_date ? (
              <span
                className={`${
                  details.in_production ? styles.status : styles.status2
                }`}
              >
                {details.in_production ? "" : " "}
              </span>
            ) : null}
            <span className={styles.estreno}>
              Estreno: {formatDate(details.release_date)}
            </span>
            <div className={styles.genero}>
              Genero:
              {details.genres?.slice(0, 3).map((genre, index) => (
                <span key={index} className={styles.genere}>
                  {genre.name}
                </span>
              ))}
            </div>
            {/* stars movie  */}
            <div className={styles.stats}>
              <div
                style={{
                  backgroundColor: `${colors(details.vote_average)}`,
                  display: "flex",
                  borderRadius: "0.5em",
                  padding: "10px 5px",
                  color: "white",
                }}
              >
                {/* STARS  */}
                  <StarRating rating={details.vote_average} />
                <div style={{ marginLeft: "10px" }} />
                <span>{Math.round(details.vote_average)}/10</span>
              </div>
            </div>
            {/* VIEW TRAILER  */}
            <div className={styles.BoxModal}>
              <ModalVideo id={id} />
            </div>
            {/* SHARE BUTTON */}
            <div>
              <ButtonShare />
            </div>
          </div>
          <p>{details.overview || "No overview available."}</p>
        </div>
      </div>
      {/* WATHC  */}
      <div className={styles.Watch}>
        <Watch id={id} />
      </div>
      {/* CASTING  */}
      <div className={styles.CastingBox}>
        <Casting id={id} />
      </div>
      {/* RECOMENDATIONS  */}
      <Recommendation id={id} />
    </section>
  );
}

const StarRating = dynamic(() => import("./StarsRating/Stars"));
const ModalVideo = dynamic(() => import("@/components/ModalVideo/ModalVideo"));
const Watch = dynamic(() => import("./WatchMovie/Watch"));
const Casting = dynamic(() => import("./Casting/Casting"));
const Recommendation = dynamic(() => import("./Recommendation/Recommendation"));
const ButtonShare = dynamic(() => import("@/components/Share/ButtonShare"));
