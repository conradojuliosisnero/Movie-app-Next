import styles from "../DetailsCard/movidedesatils.module.css";
import Image from "next/image";
import ModalVideo from "../ModalVideo/ModalVideo";
import imageNull from "../../../public/image-no-found.svg";

export default function Welcome({ dataMovieHome }) {
  const MOVIEHOME =
    dataMovieHome && dataMovieHome.length > 0 ? dataMovieHome[0] : null;

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={`https://image.tmdb.org/t/p/original${
              MOVIEHOME ? MOVIEHOME.backdrop_path : imageNull
            }`}
            alt={MOVIEHOME ? MOVIEHOME.title : "image-welcome"}
            width={100}
            height={100}
            loading="lazy"
            quality={30}
          ></Image>
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.titleMovie}>
            <span>{MOVIEHOME ? MOVIEHOME.title : ""}</span>
          </div>
          {/* movieHome generes  */}
          <div className={styles.year_generes}>
            <div className={styles.BoxModal}>
              {MOVIEHOME && MOVIEHOME.id ? (
                <ModalVideo id={MOVIEHOME.id} />
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
