export default async function seasonDetails(serieID, numberID, setSeason) {
  const Bearer = process.env.NEXT_PUBLIC_BEARER_TOKEN;
  const url = `https://api.themoviedb.org/3/tv/${serieID}/season/${numberID}}?language=es-MX`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${Bearer}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      setSeason(data)
    } else {
      console.log("error al hacer fetch");
    }
  } catch (error) {
    console.error(`ups.. algo salio mal: `, error);
  }
}
