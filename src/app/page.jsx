"use client";
import Squeleton from "../components/WelcomeHome/Squeleton";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import SqueletonSlaider from "../components/AutoPlaySlaider/SqueletonSlaider";
import { useState, useEffect } from "react";

// export const metadata = {
//   title: "moviesCon 2.0 welcome site",
//   description:
//     "Bienvenido MoviesCon 2.0 sitio para sumerguirte en el mundo del cine",
// };

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

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/home");
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  return (
    <main className={styles.name}>
      <WelcomeDynamic dataMovieHome={data} />
      <div className={styles.topMoviesContainer}>
        <AutoPlaySlaiderDynamic dataMovies={data} />
      </div>
    </main>
  );
}
