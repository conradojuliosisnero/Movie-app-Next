import styles from "../movieDetails/movidedesatils.module.css";
import "../../app/globals.css";
import StarRating from "../StarsRating/Stars";
import Image from "next/image";
import ModalSerie from "../ModalSeries/ModalSerie";
import WatchSerie from "../WatchSeries/Watch";
import CastingSerie from "../CastingSerie/Casting";
import Season from "../Season/Season";

const SerieDetails = ({ detailserie }) => {
  // convierte la fecha de estreno
  const dateConvert = () => {
    const date = new Date(detailserie.first_air_date);
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
            src={`https://image.tmdb.org/t/p/original${detailserie.backdrop_path}`}
            alt={detailserie.name}
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
          <div className={styles.titleMovie}>
            <span>{detailserie.name}</span>
          </div>
          {/* details generes  */}
          <div className={styles.year_generes}>
            <span className={styles.estreno}>Estreno: {dateConvert()}</span>
            <span
              className={`${
                detailserie.status === "Ended" ? styles.status2 : styles.status
              }`}
            >
              Estado:{" "}
              {detailserie.status === "Ended" ? "Finalizado" : "Al aire"}
            </span>
            <div className={styles.genero}>
              Genero:
              {detailserie.genres.slice(0, 3).map((genres) => (
                <span className={styles.genere}>{genres.name}</span>
              ))}
            </div>
            {/* stars movie  */}
            <div className={styles.stats}>
              <div
                className={`${
                  detailserie.vote_average >= 7
                    ? styles.starsGood
                    : styles.starsBad
                }`}
              >
                <StarRating rating={detailserie.vote_average} />
                <span className={styles.votes}>
                  {Math.floor(detailserie.vote_average)} / 10
                </span>
              </div>
            </div>
            <div className={styles.BoxModal}>
              <ModalSerie id={detailserie.id} />
            </div>
          </div>
          {detailserie.overview ? <p>{detailserie.overview}</p> : <></>}
        </div>
      </div>
      {/* donde ver  */}
      <div className={styles.Watch}>
        <WatchSerie id={detailserie.id} />
      </div>
      {/* temperadas de la serie  */}
      <div className={styles.SeasonsContainer}>
        <Season detailSeason={detailserie.seasons} />
      </div>
      {/* casting de la serie  */}
      <div className={styles.CastingBox}>
        <CastingSerie idSerie={detailserie.id} />
      </div>
    </section>
  );
};

export default SerieDetails;
