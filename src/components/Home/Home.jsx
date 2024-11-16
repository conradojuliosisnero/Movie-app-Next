"use client";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import Squeleton from "../WelcomeHome/Squeleton";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [seriesData, setDataSeries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/home");
      const data = await response.json();
      setData(data);
    }

    async function fetchDataSeries() {
      const response = await fetch("/api/series?page=1");
      const dataSeries = await response.json();
      setDataSeries(dataSeries);
    }

    fetchDataSeries();
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

const AutoPlaySlaiderDynamic = dynamic(
  () => import("@/components/AutoPlaySlaider/Slaider"),
  {
    ssr: false,
  }
);

const WelcomeDynamic = dynamic(
  () => import("@/components/WelcomeHome/Welcome"),
  {
    loading: () => <Squeleton />,
    ssr: false,
  }
);

const BentoMovies = dynamic(() => import("@/components/BentoMovies/Index"));
const BentoSeries = dynamic(() => import("@/components/BentoSeries/Index"));

const PopularSeriesDynamic = dynamic(
  () => import("@/components/Popular/PopularSeries"),
  {
    ssr: false,
  }
);
