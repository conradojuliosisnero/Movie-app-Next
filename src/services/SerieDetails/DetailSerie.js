export default async function DetailSerie(id) {
  const URL = `https://api.themoviedb.org/3/tv/${id}?language=es-MX`;
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
    }
  } catch (error) {
    throw new Error("Error fetching movie data");
  }
}
