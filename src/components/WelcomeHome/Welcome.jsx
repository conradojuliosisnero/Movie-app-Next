import styles from "../DetailsCard/movidedesatils.module.css";
import Image from "next/image";
import ModalVideo from "../ModalVideo/ModalVideo";

export default function Welcome({ dataMovieHome }) {
  const movieHome =
    dataMovieHome && dataMovieHome.length > 0 ? dataMovieHome[0] : null;
  const dateConvert = () => {
    const date = new Date(movieHome ? movieHome.release_date : "");
    const year = date.getFullYear();
    return year;
  };

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={`https://image.tmdb.org/t/p/original${
              movieHome ? movieHome.backdrop_path : ""
            }`}
            alt={movieHome ? movieHome.title : ""}
            width={100}
            layout="responsive"
            height={100}
            decoding="async"
            priority={true}
            quality={70}
          ></Image>
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.titleMovie}>
            <span>{movieHome ? movieHome.title : ""}</span>
          </div>
          {/* movieHome generes  */}
          <div className={styles.year_generes}>
            <div className={styles.BoxModal}>
              {movieHome && movieHome.id ? (
                <ModalVideo id={movieHome.id} />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
