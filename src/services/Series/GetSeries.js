const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;

const getSeries = async (setSerieData, nextPage) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/popular?language=es-MX&page=${nextPage}`,
      options
    );
    if (response.status === 200) {
      const { results } = await response.json();
      setSerieData(results);
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default getSeries;
