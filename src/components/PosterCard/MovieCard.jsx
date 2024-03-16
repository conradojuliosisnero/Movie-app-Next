"use client";
import { useState, useEffect } from "react";
import styles from "./postercard.scss";
import getMovies from "../../services/TMDB/GetMovies";

const MovieCard = () => {
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovies(setMovieData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.contenedor}>
      {movieData.map((movie) => (
        <div className={styles.pelicula} key={movie.id}>
          <div className={styles.contend__poster}>
            <img
              className={styles.poster}
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            {/* <div className={styles.contend__hover}>
              <a href="#" className={styles.movie_link}>
                More Info
              </a>
            </div> */}
          </div>
          <h3 className={styles.titulo}>{movie.title}</h3>
          <div className={styles.contend__overview} id="contend__overview">
            <div className={styles.regresar__overview}>
              <i className="fa-solid fa-x"></i>
            </div>
            {/* Aquí puedes incluir más elementos HTML según necesites */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieCard;
