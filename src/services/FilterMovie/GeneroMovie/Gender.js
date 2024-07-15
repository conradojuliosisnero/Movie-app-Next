const GetGender = async () => {
  const URL = "https://api.themoviedb.org/3/genre/movie/list?language=es-MX";
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
      return data
    } else {
      console.log("ups! something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetGender;
