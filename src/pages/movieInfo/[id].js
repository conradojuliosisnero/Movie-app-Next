import MovieDetails from "../../components/movieDetails/MovieDetails";
export default function DataMovie({ movie }) {
  return (
    <>
      <MovieDetails details={movie} />
    </>
  );
}

export async function getServerSideProps({ query: { id } }) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const url_api = `https://api.themoviedb.org/3/movie/${id}}?language=es-MX`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  const response = await fetch(url_api, options);
  const movie = await response.json();
  return {
    props: { movie },
  };
}
