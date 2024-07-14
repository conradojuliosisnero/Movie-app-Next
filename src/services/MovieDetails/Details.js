export default async function Details(id) {
  try {
    const bearer = `${process.env.BEARER_TOKEN}`;
    const url_api = `https://api.themoviedb.org/3/movie/${id}}?language=es-MX`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(url_api, options);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    throw new Error("Error fetching movie data");
  }
}
