import styles from "./movidedesatils.module.css";
import "../../app/globals.css";
import StarRating from "../StarsRating/Stars";
import Image from "next/image";
import Casting from "../Casting/Casting";
import Modal from "../Modal/Modal";
import Watch from "../WatchMovie/Watch";

const MovieDetails = ({ details }) => {
  const dateConvert = () => {
    const date = new Date(details.release_date);
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
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title}
            width={100}
            layout="responsive"
            height={100}
            quality={90}
            priority={true}
          ></Image>
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.nameMovie}>
            <span>{details.title}</span>
          </div>
          {/* details generes  */}
          <div className={styles.year_generes}>
            <span className={styles.nameMovie}>Estreno: {dateConvert()}</span>
            <div>
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
                <StarRating rating={details.vote_average} />
                <span className={styles.votes}>
                  {Math.floor(details.vote_average)} / 10
                </span>
              </div>
            </div>
            <div className={styles.BoxModal}>
              <Modal id={details.id} />
            </div>
          </div>
          <p>{details.overview}</p>
        </div>
      </div>
      <div className={styles.Watch}>
        <Watch id={details.id} />
      </div>
      <div className={styles.CastingBox}>
        <Casting idMovie={details.id} />
      </div>
    </section>
  );
};

export default MovieDetails;
