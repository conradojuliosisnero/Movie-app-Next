const getMovies = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${movieId}`
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
