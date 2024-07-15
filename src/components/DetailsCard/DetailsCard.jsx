import styles from "./movidedesatils.module.css";
import "../../app/globals.css";
import StarRating from "../StarsRating/Stars";
import Image from "next/image";
import Casting from "../Casting/Casting";
import ModalVideo from "../ModalVideo/ModalVideo";
import Watch from "../WatchMovie/Watch";
import Season from "../Season/Season";
import Image404 from "../../../public/image-no-found.svg";
import { useParams, usePathname } from "next/navigation";
import Recommendation from "../Recommendation/Recommendation";
import Temporal from "../mantenimiento/Temporal";


const MovieDetails = ({ details }) => {
  // pathname
  const pathname = useParams();

  // convert date
  const dateConvert = () => {
    const date = new Date(details.release_date || details.first_air_date);
    const year = date.getFullYear();
    return year;
  };

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={
              details.poster_path
                ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                : Image404
            }
            alt={details.title}
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
            <span className={styles.estreno}>Estreno: {dateConvert()}</span>
            {details.first_air_date ? (
              <span
                className={`${
                  details.in_production ? styles.status : styles.status2
                }`}
              >
                Estado:
                {details.in_production ? " En Emision" : " Terminada"}
              </span>
            ) : (
              ""
            )}

            <div className={styles.genero}>
              Genero:
              {details.genres.slice(0, 3).map((genres) => (
                <span className={styles.genere}>{genres.name}</span>
              ))}
            </div>
            {/* stars movie  */}
            <div className={styles.stats}>
              <div
                className={`${
                  details.vote_average >= 7 ? styles.starsGood : styles.starsBad
                }`}
              >
                {/* STARS  */}
                <StarRating rating={details.vote_average} />
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
};

export default MovieDetails;
