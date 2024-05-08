"use client"
import "./postercard.scss";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import img404 from '../../../public/image-no-found.svg'

const MediaCard = ({ data }) => {
  const pathname = usePathname();
  const { id, title, poster_path, name} = data;


  return (
    <>
      <div className="pelicula" key={id}>
        {/* img  */}
        <div className="contend__poster">
          <Image
            className="img_poster"
            key={id}
            src={`${poster_path == null || undefined || "" ? img404 : `https://image.tmdb.org/t/p/w500/${poster_path}`}`}
            width={100}
            height={100}
            loading="lazy"
            layout="responsive"
            quality={70}
            alt={title}
          ></Image>
          {/* card hover  */}
          <div className="contend__hover">
            {pathname === "/movies-series/movies-section" ? (
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
      </div>
    </>
  );
};

export default MediaCard;
