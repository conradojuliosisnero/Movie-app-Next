import DetailsCard from "../../components/DetailsCard/DetailsCard";
import DetailSerie from "../../services/SerieDetails/DetailSerie";
import Loading from "../../components/Loader/Loading";
import MovieLayout from "../Layout";

export default function DataSerie({ serie, loading }) {
  return (
    <MovieLayout>
      {loading ? <Loading /> : <DetailsCard details={serie} />}
    </MovieLayout>
  );
}

export async function getServerSideProps({ query: { idserie } }) {
  try {
    // Detalles de la Serie
    const DetailsResponse = await DetailSerie(idserie);
    if (DetailsResponse && DetailsResponse.status === 200) {
      const serie = await DetailsResponse.json();
      return { props: { serie } }; // Aquí se retorna un objeto con props
    }
  } catch (error) {
    console.error("Algo salió mal", error);
    return { props: { serie: null, loading: false } }; // También aquí se retorna un objeto con props
  }

  // Si ninguno de los casos anteriores se cumple, deberías agregar un retorno por defecto
  return { props: {} }; // O un objeto vacío si no hay nada que pasar como props
}
