const GetGenderFiltered = async (setGenderFiltered, nextpage, valueGender) => {
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
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-MX&page=${nextpage}&sort_by=popularity.desc&with_genres=${valueGender}`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      setGenderFiltered(data);
    } else {
      console.log("algo salio mal al hacer fetch");
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetGenderFiltered;
