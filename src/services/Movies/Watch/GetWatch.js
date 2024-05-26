
const GetWatch = async (ID, setWatch) => {
  try {
    const bearer = `${process.env.NEXT_PUBLIC_BEARER_TOKEN}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${ID}/watch/providers`,
      options
    );
    if (response.status === 200) {
      const {
        results: {
          CO: { rent },
        },
      } = await response.json();
      setWatch(rent);
    }
  } catch (error) {
    console.error(error);
  }
};

export default GetWatch;
