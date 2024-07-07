const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;
const GetVideosMovies = async (movieID, setKeyVideoMovie) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      let keyEncontrada = null;
      data.results.forEach((obj) => {
        if (obj.name === "Official Trailer") {
          keyEncontrada = obj.key;
        }
        return null;
      });
      setKeyVideoMovie(keyEncontrada);
    } else {
      throw new Error("Error en la llamada a la API");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetVideosMovies;
