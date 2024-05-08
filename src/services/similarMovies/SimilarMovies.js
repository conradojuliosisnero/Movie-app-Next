const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;

const SimilarMovies = async (id) => {
  try {
    const url_api = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US`;
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
