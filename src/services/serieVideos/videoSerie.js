const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;

const GetVideoSeries = async (serieID, setKeyVideoSerie) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${serieID}/videos?language=en-US`,
      options
    );

    if (response.status === 200) {
      const data = await response.json();
      let keyEncontrada = null;
      data.results.forEach((obj) => {
        if (obj.key) {
          keyEncontrada = obj.key;
        }
        return null;
      });
      setKeyVideoSerie(keyEncontrada);
    } else {
      console.log("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetVideoSeries;
