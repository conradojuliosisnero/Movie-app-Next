import { NextResponse } from "next/server";
import getMovies from "../../../services/TMDB/GetMovies";

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1; 

  try {
    const data = await getMovies(page);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 });
  }
}
