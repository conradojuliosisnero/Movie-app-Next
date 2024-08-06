"use client";
import Squeleton from "../components/WelcomeHome/Squeleton";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import SqueletonSlaider from "../components/AutoPlaySlaider/SqueletonSlaider";
import { useState, useEffect } from "react";

const AutoPlaySlaiderDynamic = dynamic(
  () => import("../components/AutoPlaySlaider/Slaider"),
  {
    loading: () => <SqueletonSlaider />,
    ssr: false,
  }
);

const WelcomeDynamic = dynamic(
  () => import("../components/WelcomeHome/Welcome"),
  {
    loading: () => <Squeleton />,
    ssr: false,
  }
);

const PopularSeriesDynamic = dynamic(() =>
  import("../components/Popular/PopularSeries")
);

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
        <AutoPlaySlaiderDynamic dataMovies={data} />
      </div>
      {/*  POPULAR SERIES */}
      <div className={styles.topSeriesContainer}>
        <PopularSeriesDynamic dataSeries={seriesData} />
      </div>
    </main>
  );
}
