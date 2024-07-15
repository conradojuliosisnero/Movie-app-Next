import GetRecommendation from "../../../../services/RecommendationMovie/MovieRC";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    const data = await GetRecommendation(id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error(
      { status: 500 },
      { message: "Error en la llamada a la API" }
    );
  }
}
