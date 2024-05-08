import "./postercard.scss";
import Link from "next/link";
import Image from "next/image";

const MovieCard = ({ datamovie }) => {
  return (
    <>
      <div className="pelicula" key={datamovie.id}>
        {/* img  */}
        <div className="contend__poster">
          <Image
            className="img_poster"
            key={datamovie.id}
            src={`https://image.tmdb.org/t/p/w500/${datamovie.poster_path}`}
            width={100}
            height={100}
            loading="lazy"
                        style={{ width: "100%", height: "auto" }}
            quality={90}
            alt={datamovie.title}
          ></Image>
          {/* card hover  */}
          <div className="contend__hover">
            <Link href={`/movie/${datamovie.id}`} className="movie_link">
              <button className="button-preview"><p>{datamovie.title}</p></button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieCard;

