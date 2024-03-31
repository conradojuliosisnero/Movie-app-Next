import styles from "./movidedesatils.module.css";
import "../../app/globals.css";
import StarRating from "../StarsRating/Stars";

const MovieDetails = ({ details }) => {
  return (
    <section className={styles.sectionMovie}>
      {/* background movie  */}
      <div className={styles.backgroundDetails}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`}
          alt={details.title}
        />
      </div>
      {/* wrap movie  */}
      <div className={styles.container}>
        <div className={styles.nameMovie}>
          <span>{details.title}</span>
        </div>
        {/* img movie  */}
        <div className={styles.imgmovie}>
          <img
            src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`}
            alt={details.title}
          />
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          <p>{details.overview}</p>
        </div>
        {/* stats movie  */}
        <div className={styles.stats}>
          <div className={styles.stars}>
            <StarRating rating={details.vote_average} />
            <span className={styles.votes}>
              {Math.floor(details.vote_average)} /10
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetails;
