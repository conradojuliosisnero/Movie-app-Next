import { NextResponse } from "next/server";
import seasonDetails from "@/services/SeasonDetail/SeasonDetails";

export async function GET(request) {
  const url = new URL(request.url);
  const serieID = url.searchParams.get("serieID");
  const numberID = url.searchParams.get("numberID");
  try {
    const data = await seasonDetails(serieID, numberID);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error(
      { status: 500 },
      { message: "ups.. algo salio mal" }
    );
  }
}
