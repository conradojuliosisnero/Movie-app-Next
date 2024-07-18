export default async function GetWatchSerie(id) {
  const URL = `https://api.themoviedb.org/3/tv/${id}/watch/providers`;
  const bearer = `${process.env.BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(URL, options);
    if (response.status === 200) {
      const data = await response.json();
      const {
        results: {
          CO: { flatrate },
        },
      } = data;
      return flatrate;
    } else {
      console.log("Error no se encontraron datos de watch serie");
    }
  } catch (error) {
    console.error(error);
  }
}
