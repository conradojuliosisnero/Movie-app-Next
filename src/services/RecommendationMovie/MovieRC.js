const GetRecommendation = async (id) => {
  console.log(id);
  const URL = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=es-MX&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
    },
  };
  try {
    const response = await fetch(URL, options);
    if (response) {
      const data = await response.json();
      return data;
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetRecommendation;
