const getMoviesHome = async (setDataMoviesHome) => {
  const apikey = process.env.NEXT_PUBLIC_MOVIES_API_KEY;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=es-MX&page=1`
    );
    if (response.status === 200) {
      const results = await response.json();
      setDataMoviesHome(results);
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getMoviesHome;
