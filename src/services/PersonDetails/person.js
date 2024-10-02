export default async function PersonDetails(id) {
  const bearer = `${process.env.BEARER_TOKEN}`;
  const url_api = `https://api.themoviedb.org/3/person/${id}?language=es-MX`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${bearer}`,
    },
  };
  try {
    const response = await fetch(url_api, options);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error("Error fetching movie data");
  }
}
