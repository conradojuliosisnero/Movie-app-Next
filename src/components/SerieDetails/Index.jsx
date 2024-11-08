import styles from "./movidedesatils.module.css";
import "../../app/globals.css";
import StarRating from "../StarsRating/Stars";
import Image from "next/image";
import Image404 from "../../../public/image-no-found.svg";
import dynamic from "next/dynamic";
import ButtonShare from "@/components/Share/ButtonShare";
import { useParams } from "next/navigation";
import { colors, dateConvert } from "@/utils/utils";
export default function SerieDetails({ id }) {
  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={
              details?.poster_path
                ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                : Image404
            }
            alt={details.title ? details.title : details.name}
            width={100}
            layout="responsive"
            height={100}
            decoding="async"
            priority={true}
            quality={30}
          ></Image>
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
              <>
                <span
                  className={`${
                    details.in_production ? styles.status : styles.status2
                  }`}
                >
                  {details.in_production ? "" : " "}
                </span>
              </>
            ) : (
              ""
            )}
            <span className={styles.estreno}>
              Estreno:{" "}
              {dateConvert(details.release_date || details.first_air_date)}
            </span>
            <div className={styles.genero}>
              Genero:
              {details.genres.slice(0, 3).map((genres) => (
                <span className={styles.genere}>{genres.name}</span>
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
                <div style={{ marginLeft: "10px" }}></div>
                <span className={styles.votes}>
                  {Math.floor(details.vote_average)} / 10
                </span>
              </div>
            </div>
            {/* VIEW TRAILER  */}
            <div className={styles.BoxModal}>
              <ModalVideo id={details.id} />
            </div>
          </div>
          <p>{details.overview}</p>
        </div>
      </div>
      {/* WATHC  */}
      <div className={styles.Watch}>
        <Watch id={details.id} />
      </div>
      {/* SHARE BUTTON */}
      <div>
        <ButtonShare />
      </div>
      {/* SEASONS  */}
      {pathname.idserie == details.id ? (
        <Season detailSeason={details.seasons} idSeason={details.id} />
      ) : (
        ""
      )}
      {/* CASTING  */}
      <div className={styles.CastingBox}>
        <Casting id={details.id} />
      </div>
      {/* RECOMENDATIONS  */}
      <Recommendation id={details.id} />
    </section>
  );
}

const Season = dynamic(() => import("../Season/Season"));
const Recommendation = dynamic(() =>
  import("../Recommendation/Recommendation")
);
const Casting = dynamic(() => import("../Casting/Casting"));
const ModalVideo = dynamic(() => import("../ModalVideo/ModalVideo"));
const Watch = dynamic(() => import("../MovieDetails/WatchMovie/Watch"));
