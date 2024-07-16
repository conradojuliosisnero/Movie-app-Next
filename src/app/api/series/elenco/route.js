import SerieCasting from "@/services/CastingSerie/CastingSerie";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const serieId = url.searchParams.get("id");
  try {
    const data = await SerieCasting(serieId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.error(
      { status: 500 },
      { error: "Error al cargar elenco de la serie." }
    );
  }
}
