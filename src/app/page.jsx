"use client";
import styles from "./page.module.css";
import getMoviesHome from "../services/moviesHome/GetMovies";
import { useState, useEffect } from "react";
import AutoPlaySlaider from "../components/AutoPlaySlaider/Slaider";
import Welcome from "../components/WelcomeHome/Welcome";

const Home = () => {
  const [dataMoviesHome, setDataMoviesHome] = useState({});
  const { results } = dataMoviesHome;

  useEffect(() => {
    const dataMovies = async () => {
      try {
        const response = await getMoviesHome(setDataMoviesHome);
      } catch (error) {
        console.error(error);
      }
    };
    dataMovies();
  }, []);


  return (
    <main className={styles.name}>
      <Welcome dataMovieHome={results} />
      <div className={styles.topMoviesContainer}>
        <AutoPlaySlaider dataMovies={results} />
      </div>
    </main>
  );
};

export default Home;
