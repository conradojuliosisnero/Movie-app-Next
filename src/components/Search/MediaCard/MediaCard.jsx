import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import img404 from "../../../../public/image-no-found.svg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import "./postercard.scss";

const MediaCard = ({ data }) => {
  const pathname = usePathname();
  const { id, title, poster_path, name, media_type } = data;

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  function percentage() {
    const percentage = Math.round(data.vote_average * 10);
    return percentage;
  }
  const percentag = percentage();

  function colors() {
    if (percentag >= 67) {
      return "#33f04d";
    } else if (percentag >= 54) {
      return "#f0d531";
    } else {
      return "#f04d4d";
    }
  }

  const color = colors();

  return (
    <>
      <motion.div className="pelicula" key={id} variants={item}>
        {/* img  */}
        <div className="contend__poster">
          <Image
            className="img_poster"
            key={id}
            src={
              poster_path == null || undefined || ""
                ? img404
                : `https://image.tmdb.org/t/p/w500/${poster_path}`
            }
            width={100}
            height={100}
            layout="responsive"
            quality={30}
            loading="lazy"
            alt={title}
          />

          <div className="contend_type">
            {media_type === "movie" ? (
              <p className="type_movie">Pelicula</p>
            ) : media_type === "tv" ? (
              <p className="type_serie">Serie</p>
            ) : (
              <p className="type_desconocido">Desconocido</p>
            )}
          </div>
          {/* CARD HOVER  */}
          <div className="contend__hover">
            <Link
              href={
                media_type === "movie"
                  ? `/movie-details/${id}`
                  : `serie-details/${id}`
              }
              className="movie_link"
            >
              <button className="button-preview">
                <p>{title}</p>
              </button>
            </Link>
          </div>

          {/* PROGRESS BAR  */}
          <div className="circle_progress_bar">
            <CircularProgressbar
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "butt",
                textSize: "16px",
                pathTransitionDuration: 0.3,
                pathColor: `${color}`,
                textColor: "#fff",
                trailColor: "#d6d6d6",
              })}
              value={percentag}
              text={`${percentag}%`}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default dynamic(() => Promise.resolve(MediaCard));
