import getMoviesHome from "../services/moviesHome/GetMovies";
import AutoPlaySlaider from "../components/AutoPlaySlaider/Slaider";
import Welcome from "../components/WelcomeHome/Welcome";
import styles from "./page.module.css";

export const metadata = {
  title: "moviesCon 2.0 welcome site",
  description:
    "bienvenido MoviesCon 2.0 sitio para sumerguirte en el mundo del cine",
};

export default async function Home() {
  const results = await getMoviesHome();
  return (
    <main className={styles.name}>
      <Welcome dataMovieHome={results} />
      <div className={styles.topMoviesContainer}>
        <AutoPlaySlaider dataMovies={results} />
      </div>
    </main>
  );
}
