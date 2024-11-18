"use client";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import Squeleton from "../WelcomeHome/Squeleton";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AutoPlaySlaiderDynamic = dynamic(() =>
  import("@/components/AutoPlaySlaider/Slaider")
);

const WelcomeDynamic = dynamic(
  () => import("@/components/WelcomeHome/Welcome"),
  {
    loading: () => <Squeleton />,
  }
);

const BentoMovies = dynamic(() => import("@/components/BentoMovies/Index"));
const BentoSeries = dynamic(() => import("@/components/BentoSeries/Index"));

const PopularSeriesDynamic = dynamic(() =>
  import("@/components/Popular/PopularSeries")
);

export default function Home() {
  const [data, setData] = useState([]);
  const [seriesData, setDataSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesHome, seriesHome] = await Promise.all([
          fetch("/api/home"),
          fetch("/api/series?page=1"),
        ]);

        if (!moviesHome.ok || !seriesHome.ok) {
          throw new Error("Error al cargar los datos");
        }
        const data = await moviesHome.json();
        const dataSeries = await seriesHome.json();
        setData(data);
        setDataSeries(dataSeries);
      } catch (error) {
        toast.error("Error al cargar los datos");
      }
    };

    fetchData();
  }, []);

  return (
    <main className={styles.name}>
      {/* WELCOME HOME  */}
      <WelcomeDynamic dataMovieHome={data} />
      {/* POPULAR MOVIES */}
      <div className={styles.topMoviesContainer}>
        <BentoMovies data={data} name="Peliculas" />
      </div>
      <div className={styles.topMoviesContainer}>
        <AutoPlaySlaiderDynamic dataMovies={data} />
      </div>
      <div className={styles.topMoviesContainer}>
        <BentoSeries data={seriesData} name="Series" />
      </div>
      {/*  POPULAR SERIES */}
      <div className={styles.topSeriesContainer}>
        <PopularSeriesDynamic dataSeries={seriesData} />
      </div>
    </main>
  );
}
