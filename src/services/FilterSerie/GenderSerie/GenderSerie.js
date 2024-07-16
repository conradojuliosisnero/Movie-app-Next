export default async function GetGenderSerie() {
  const URL = "https://api.themoviedb.org/3/genre/tv/list?language=es-MX";
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
      console.log("ups algo salio mal al obtener los generos de las series");
    }
  } catch (error) {
    console.error(error);
  }
}
