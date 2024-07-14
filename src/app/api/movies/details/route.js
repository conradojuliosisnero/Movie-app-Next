import { NextResponse } from "next/server";
import Details from "../../../../services/MovieDetails/Details";

export async function GET(request) {
  const url = new URL(request.url);
  const movieId = url.searchParams.get("id");
  
  try {
    const data = await Details(movieId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 });
  }
}
