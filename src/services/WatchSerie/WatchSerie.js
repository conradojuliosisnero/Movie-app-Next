const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;

const GetWatchSerie = async (ID, setWatch) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${ID}/watch/providers`,
      options
    );
    if (response.status === 200) {
      const {
        results: {
          CO: { flatrate },
        },
      } = await response.json();
      setWatch(flatrate);
    } else {
      console.log("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetWatchSerie;
