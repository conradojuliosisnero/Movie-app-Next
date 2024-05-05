const DetailSerie = async (id) => {
  try {
    const bearer = `${process.env.BEARER_TOKEN}`;
    const url_api = `https://api.themoviedb.org/3/tv/${id}?language=es-MX`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(url_api, options);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    throw new Error("Error fetching movie data");
  }
};

export default DetailSerie;
