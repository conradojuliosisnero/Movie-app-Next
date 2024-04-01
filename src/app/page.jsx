"use client";
import styles from "./page.module.css";
import getMoviesHome from "../services/moviesHome/GetMovies";
import { useState, useEffect } from "react";
import AutoPlaySlaider from "../components/home/home";

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
      <div className={styles.name}>
        <span className={styles.name}></span>
      </div>
      <AutoPlaySlaider dataMovies={results} />
    </main>
  );
};

export default Home;
