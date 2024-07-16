export default async function SerieCasting(idserie) {
  const URL = `https://api.themoviedb.org/3/tv/${idserie}/credits?language=es-ES`;
  const bearer = `${process.env.BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(URL, options);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error("algo salio mal al cargar elenco de la serie");
    }
  } catch (error) {
    console.error(error);
  }
}
