export default async function getNowMovies(page) {
  const URL = `https://api.themoviedb.org/3/movie/now_playing?language=es-MX&page=${page}`;
  const OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  };
  try {
    const response = await fetch(URL, OPTIONS);
    if (response.status !== 200) {
      throw new Error("Error al obtener los datos");
    }
      const data = await response.json();
      console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}
