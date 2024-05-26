const GetGenderSerie = async (setGender) => {
  const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/genre/tv/list?language=es-MX",
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      setGender(data);
    } else {
      console.log("algo salio mal al hacer fetch");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetGenderSerie;
