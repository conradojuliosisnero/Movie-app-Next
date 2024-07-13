const GetSearch = async (value) => {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=es-MX&page=1`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetSearch;
