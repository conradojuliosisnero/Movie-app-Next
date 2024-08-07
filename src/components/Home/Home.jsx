import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import SqueletonSlaider from "../AutoPlaySlaider/SqueletonSlaider";
import Squeleton from "../WelcomeHome/Squeleton";

const AutoPlaySlaiderDynamic = dynamic(
  () => import("@/components/AutoPlaySlaider/Slaider"),
  {
    loading: () => <SqueletonSlaider />,
  }
);

const WelcomeDynamic = dynamic(
  () => import("@/components/WelcomeHome/Welcome"),
  {
    loading: () => <Squeleton />,
    ssr: false,
  }
);

const PopularSeriesDynamic = dynamic(() =>
  import("@/components/Popular/PopularSeries")
);

export default function Home({ data, seriesData }) {
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
