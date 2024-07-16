// "use client"
import "./postercard.scss";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import img404 from '../../../public/image-no-found.svg'
import { motion } from "framer-motion";

const MediaCard = ({ data }) => {
  const pathname = usePathname();
  const { id, title, poster_path, name} = data;

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
          ></Image>
          {/* card hover  */}
          <div className="contend__hover">
            {pathname === "/movies" ? (
              <Link href={`/movie/${id}`} className="movie_link">
                <button className="button-preview">
                  <p>{title}</p>
                </button>
              </Link>
            ) : (
              <Link href={`/serie/${id}`} className="movie_link">
                <button className="button-preview">
                  <p>{title || name}</p>
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MediaCard;
