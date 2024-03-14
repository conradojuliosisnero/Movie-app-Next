import styles from "./poster_card.scss";
import { getMovies } from "../../services/TMDB/GetMovies";

const MovieCard = async () => {
  const movieId = 1;
  const getDataMovies = await getMovies(movieId);

  return (
    <div className={styles.pelicula}>
      <div className={styles.contend__poster}>
        <img
          className={styles.poster}
          // src={`https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`}
        />
        <div className={styles.contend__hover}>
          <a href="#" className={styles.movie_link}>
            More Info
          </a>
        </div>
      </div>
      <h3 className={styles.titulo}></h3>
      <div className={styles.contend__overview} id="contend__overview">
        <div className={styles.regresar__overview}>
          <i className="fa-solid fa-x"></i>
        </div>
        {/* <p class="sinopsis">📖 Sinopsis<br><br>${pelicula.overview}</p>				
					<p class="popularity"> ⭐ Popularidad: ${pelicula.popularity}</p>
					<p class="publicacion"> 📅 Publicada: ${pelicula.release_date}</p> */}
      </div>
    </div>
  );
};
export default MovieCard;
