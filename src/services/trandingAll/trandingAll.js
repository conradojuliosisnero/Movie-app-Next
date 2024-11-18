export default async function getTrandingAll() {
  const TOKENT = `${process.env.BEARER_TOKEN}`;
  const URL = `https://api.themoviedb.org/3/trending/all/day?language=es-MX`;
  const OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKENT}`,
    },
  };
  try {
    const response = await fetch(URL, OPTIONS);
    if (response.status !== 200) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
