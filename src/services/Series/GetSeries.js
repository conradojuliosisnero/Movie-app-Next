export default async function getSeries(nextPage) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  const URL = `https://api.themoviedb.org/3/tv/popular?language=es-MX&page=${nextPage}`;
  try {
    const response = await fetch(URL, options);
    if (response.status === 200) {
      const { results } = await response.json();
      return results;
    } else {
      console.error("ups! algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
}
