const getMovies = async (setMovieData) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=1`
    );
    if (response.status === 200) {
      const { results } = await response.json();
      setMovieData(results);
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getMovies;
