import DetailsCard from "../../components/DetailsCard/DetailsCard";
import Details from "../../services/MovieDetails/Details";
import Loading from "../../components/Loader/Loading";
import MovieLayout from "../Layout";

export default function DataMovie({ movie, loading }) {
  return (
    <>
      <MovieLayout>
        {loading ? <Loading /> : <DetailsCard details={movie} />}
      </MovieLayout>
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
  } catch (error) {
    console.error("algo salio mal", error);
  }
}
