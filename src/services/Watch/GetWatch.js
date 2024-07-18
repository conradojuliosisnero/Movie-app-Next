export default async function GetWatchVideos (ID){
  const URL = `https://api.themoviedb.org/3/movie/${ID}/watch/providers`;
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
      const {
        results: {
          CO: { rent, buy },
        },
      } = data;
      return { rent, buy };
    }
  } catch (error) {
    console.error(error);
  }
};

