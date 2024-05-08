const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;

const GetSearchSeries = async (setDataSearch, value) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
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
