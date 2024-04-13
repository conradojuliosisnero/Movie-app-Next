import MovieDetails from "../../components/movieDetails/MovieDetails";
import Details from "../../services/MovieDetails/Details";
import Loading from '../../components/Loader/Loading'

export default function DataMovie({ movie,loading}) {
    return <>{loading ? <Loading/>  : <MovieDetails details={movie}/>}</>;
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
