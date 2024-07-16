export default async function GetRecomendationSerie(id) {
  const URL = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=es-MX&page=1`;
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
      console.error("algo salio mal al cargar recomendaciones de la serie");
    }
  } catch (error) {
    console.error(error);
  }
};

