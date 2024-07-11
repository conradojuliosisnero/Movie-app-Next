import getMoviesHome from "../services/moviesHome/GetMovies";
import Squeleton from "../components/WelcomeHome/Squeleton";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import SqueletonSlaider from "../components/AutoPlaySlaider/SqueletonSlaider";

export const metadata = {
  title: "moviesCon 2.0 welcome site",
  description:
    "Bienvenido MoviesCon 2.0 sitio para sumerguirte en el mundo del cine",
};

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

export default async function Home() {
  const results = await getMoviesHome();
  return (
    <main className={styles.name}>
      <WelcomeDynamic dataMovieHome={results} />
      <div className={styles.topMoviesContainer}>
        <AutoPlaySlaiderDynamic dataMovies={results} />
      </div>
    </main>
  );
}
