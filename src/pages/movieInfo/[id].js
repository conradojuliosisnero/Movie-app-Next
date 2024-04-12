import MovieDetails from "../../components/movieDetails/MovieDetails";
import Details from "../../services/MovieDetails/Details";
import SimilarMovies from "../../components/similarMovies/SimilaarMovies";
export default function DataMovie({ movie }) {
  return (
    <>
      <MovieDetails details={movie} />
    </>
  );
}

export async function getServerSideProps({ query: { id } }) {
  try {
    // Detalles de Peliculas
    const DetailsResponse = await Details(id);
    if (DetailsResponse.status === 200) {
      const movie = await DetailsResponse.json();
      return { props: { movie } };
    }
    // Peliculas Similares
    const SimilarMovie = await SimilarMovies(id);
    const similar = await SimilarMovie.json();
    return {
      props: { similar },
    };
  } catch (error) {
    console.error("algo salio mal", error);
  }
}
