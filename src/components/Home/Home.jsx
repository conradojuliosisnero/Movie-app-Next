"use client";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SkeletonHome from "./SkeletonHome";

const PopularMoviesSlider = dynamic(() =>
  import("@/components/AutoPlaySlaider/Slaider")
);

const WelcomeDynamic = dynamic(
  () => import("@/components/WelcomeHome/Welcome"));

const BentoMovies = dynamic(() => import("@/components/BentoMovies/Index"));
const BentoSeries = dynamic(() => import("@/components/BentoSeries/Index"));

const PopularSeriesDynamic = dynamic(() =>
  import("@/components/Popular/PopularSeries")
);

const Home = ()=> {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seriesData, setDataSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        include: "credentials",
      };
      try {
        const [moviesHome, seriesHome] = await Promise.all([
          fetch("/api/home",OPTIONS),
          fetch("/api/series?page=1",OPTIONS),
        ]);

        if (!moviesHome.ok || !seriesHome.ok) {
          throw new Error("Error al cargar los datos");
        }
        const data = await moviesHome.json();
        const dataSeries = await seriesHome.json();
        setData(data);
        setDataSeries(dataSeries);
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar los datos");
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) { 
    return <SkeletonHome/>;
  }

  return (
    <main className={styles.name}>
      {/* WELCOME HOME  */}
      <WelcomeDynamic dataMovieHome={data} />
      {/* POPULAR MOVIES */}
      <div className={styles.topMoviesContainer}>
        <BentoMovies data={data} name="Peliculas" />
      </div>
      <div className={styles.topMoviesContainer}>
        <PopularMoviesSlider dataMovies={data} />
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

export default dynamic(() => Promise.resolve(Home));
