import { useRouter } from "next/router";
import GetMovies from "../../../services/TMDB/GetMovies";

const MovieInfo = async () => {
  const router = useRouter();
  console.log(router);
  // Obtiene el ID de la URL
  // const { id } = router.query;

  const dataMovies = await GetMovies();

  return (
    <main className="contendDetails">
      <div className="movieInfo">
        <div className="MovieImg">
          <img src="" alt="" />
        </div>
        <div className="MovieDetails"></div>
        <div className="movieSinopsis"></div>
      </div>
    </main>
  );
};

export default MovieInfo;
