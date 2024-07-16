export default async function FilterGenderSerie(nextpage, valueGender) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const URL = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=es-MX&page=${nextpage}&sort_by=popularity.desc&with_genres=${valueGender}`;
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
      console.log("ups algo salio mal al filtrar las series");
    }
  } catch (error) {
    console.error(error);
  }
}
