const GetVideosMovies = async (movieID, setKeyVideo) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Njg0ZDExODUzOGVkMmZmM2MyODgyZmUyYjZlMmUyZSIsInN1YiI6IjY0YmQ0MGExYWM2Yzc5MDhkYjViZDU3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KD8jSPO7IrgEGDlz62ucK8LFBRyxziQEm87VQncvlwc",
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
        if (obj.official) {
          keyEncontrada = obj.key;
        }
        return null;
      });
      setKeyVideo(keyEncontrada);
    } else {
      console.log("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetVideosMovies;
