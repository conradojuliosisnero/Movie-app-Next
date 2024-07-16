export default async function GetVideoSeries(serieID) {
  const URL = `https://api.themoviedb.org/3/tv/${serieID}/videos?language=es-MX`;
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
      let keyEncontrada = null;
      data.results.forEach((obj) => {
        if (
          obj.name == "Official Trailer" ||
          "Official Trailer [doblado]" ||
          "Official Trailer [Subtitulado]"
        ) {
          keyEncontrada = obj.key;
        }
        return null;
      });
      return keyEncontrada;
    } else {
      console.log("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
}
