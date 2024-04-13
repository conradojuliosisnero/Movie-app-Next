import "./postercard.scss";
import Link from "next/link";

const MovieCard = ({ datamovie }) => {
  return (
    <div>
      <div className="pelicula" key={datamovie.id}>
        {/* img  */}
        <div className="contend__poster">
          <img
            className="poster"
            src={`https://image.tmdb.org/t/p/w500/${datamovie.poster_path}`}
            alt={datamovie.title}
          />
          {/* card hover  */}
          <div className="contend__hover">
            <Link href={`/movie/${datamovie.id}`} className="movie_link">
              <button className="button-preview">Preview</button>
            </Link>
          </div>
        </div>
        {/* title  */}
        <h3 className="titulo">
          <span>{datamovie.title}</span>
        </h3>
        {/* hover effect  */}
        <div className="contend__overview" id="contend__overview">
          <div className="regresar__overview">
            <i className="fa-solid fa-x"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
