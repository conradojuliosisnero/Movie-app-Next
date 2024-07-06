const getMovies = async (setMovieData, nextPage) => {
  const apikey = process.env.NEXT_PUBLIC_MOVIES_API_KEY;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=es-MX&page=${nextPage}`
    );
    if (response.status === 200) {
      const data = await response.json();
      setMovieData(data);
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getMovies;
