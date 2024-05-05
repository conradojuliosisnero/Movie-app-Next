import Link from "next/link";
import Image from "next/image";
import "../PosterCard/postercard.scss";

const SerieCard = ({ dataserie }) => {
  return (
    <>
      <div className="pelicula" key={dataserie.id}>
        {/* img  */}
        <div className="contend__poster">
          <Image
            className="img_poster"
            key={dataserie.id}
            src={`https://image.tmdb.org/t/p/w500/${dataserie.poster_path}`}
            width={100}
            height={100}
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            quality={60}
            alt={dataserie.name}
          />
          {/* card hover  */}
          <div className="contend__hover">
            <Link href={`/serie/${dataserie.id}`} className="movie_link">
              <button className="button-preview">
                <p>{dataserie.name}</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SerieCard;
