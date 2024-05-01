const GetRecommendation = async (id, setDataRC) => {
  const URL = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Njg0ZDExODUzOGVkMmZmM2MyODgyZmUyYjZlMmUyZSIsInN1YiI6IjY0YmQ0MGExYWM2Yzc5MDhkYjViZDU3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KD8jSPO7IrgEGDlz62ucK8LFBRyxziQEm87VQncvlwc",
    },
  };
  try {
    const response = await fetch(URL, options);
    if (response) {
      const data = await response.json();
      setDataRC(data)
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetRecommendation;
