export default async function GetSearchSeries(value) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const URL = `https://api.themoviedb.org/3/search/tv?query=${value}&include_adult=false&language=es-MX`;
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
      console.log("algo salio mal al buscar la pelicula");
    }
  } catch (error) {
    console.error(error);
  }
}
