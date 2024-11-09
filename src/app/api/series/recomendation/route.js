import GetRecomendationSerie from "@/services/RecommendationSerie/SerieRC";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const serieId = url.searchParams.get("id");
  try {
      const data = await GetRecomendationSerie(serieId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 500 },
      { error: "Error al cargar recomendaciones de la serie." }
    );
  }
}
