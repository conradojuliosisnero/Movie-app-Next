const GetSearchSeries = async (setDataSearch, value) => {
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
      `https://api.themoviedb.org/3/search/tv?query=${value}&include_adult=false&language=es-MX`,
      options
    );

    if (response.status === 200) {
      const data = await response.json();
      setDataSearch(data);
    } else {
      console.log("algo salio mal al buscar la pelicula");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetSearchSeries;
