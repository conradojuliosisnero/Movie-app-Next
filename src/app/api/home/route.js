import { NextResponse } from "next/server";
import getMovies from "../../../services/TMDB/GetMovies";

export async function GET() {
  try {
    const { results } = await getMovies(1);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 });
  }
}
