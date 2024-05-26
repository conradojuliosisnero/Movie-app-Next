const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;
const SerieCasting = async (idserie) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${idserie}/credits?language=es-ES`,
      options
    );

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error("algo salio mal");
    }
  } catch (error) {
    console.error(error);
  }
};

export default SerieCasting;
