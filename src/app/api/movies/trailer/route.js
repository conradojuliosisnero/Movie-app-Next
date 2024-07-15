import GetVideosMovies from "../../../../services/MovieVideos/MovieVideos";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const idMovie = url.searchParams.get("id");
  try {
    const data = await GetVideosMovies(idMovie);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error en la llamada a la API" },
      { status: 500 }
    );
  }
}
