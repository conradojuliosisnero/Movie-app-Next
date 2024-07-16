import DetailsCard from "@/components/DetailsCard/DetailsCard";
import Loading from "@/components/Loader/Loading";
import MovieLayout from "../Layout";

export default function DataSerie({ serie, loading }) {
  return (
    <MovieLayout>
      {loading ? <Loading /> : <DetailsCard details={serie} />}
    </MovieLayout>
  );
}

export async function getServerSideProps({ query: { idserie }, req }) {
  // Construye la URL base dependiendo del entorno (desarrollo o producción)
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host; // Obtiene el host desde los headers de la solicitud
  const baseUrl = `${protocol}://${host}`;

  try {
    // Usa la URL base para hacer el fetch a la ruta API
    const response = await fetch(`${baseUrl}/api/series/details?id=${idserie}`);
    const serie = await response.json();
    return {
      props: {
        serie,
        loading: false,
      },
    };
  } catch (error) {
    // Maneja el error como consideres necesario
    return {
      props: {
        error: "Error al cargar los detalles de la serie.",
      },
    };
  }
}
