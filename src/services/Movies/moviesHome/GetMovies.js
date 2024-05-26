const getMoviesHome = async () => {
  const APIKEY = process.env.MOVIES_API_KEY;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=es-MX&page=1`
    );
    if (response.status === 200) {
      const { results } = await response.json();
      return results;
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getMoviesHome;
