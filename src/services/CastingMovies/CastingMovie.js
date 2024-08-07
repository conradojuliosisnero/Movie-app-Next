export default async function CastingMovie (idMovie) {
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
      `https://api.themoviedb.org/3/movie/${idMovie}/credits?language=es-MX`,
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


