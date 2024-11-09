import { NextResponse } from "next/server";
import GetWatchSerie from "@/services/WatchSerie/WatchSerie";

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    const watch = await GetWatchSerie(id);
    return NextResponse.json(watch, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
