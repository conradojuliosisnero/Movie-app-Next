export default async function getMovies(page) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
    cache: "no-store",
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=es-MX&page=${page}`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return error;
  }
}
