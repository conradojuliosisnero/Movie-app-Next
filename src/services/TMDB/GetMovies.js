const getMovies = async (setMovieData, nextPage) => {
  const APIKEY = process.env.MOVIES_API_KEY;
  const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=es-MX&page=${nextPage}`;
  try {
    const response = await fetch(URL);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setMovieData(data);
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getMovies;
