const GetGenderFiltered = async (setGenderFiltered, valueGender) => {
  console.log(valueGender);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Njg0ZDExODUzOGVkMmZmM2MyODgyZmUyYjZlMmUyZSIsInN1YiI6IjY0YmQ0MGExYWM2Yzc5MDhkYjViZDU3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KD8jSPO7IrgEGDlz62ucK8LFBRyxziQEm87VQncvlwc",
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-MX&page=1&sort_by=popularity.desc&with_genres=${valueGender}`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      setGenderFiltered(data);
    } else {
      console.log("algo salio mal al hacer fetch");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetGenderFiltered;
