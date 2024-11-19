import { NextResponse } from "next/server";
import getSearch from "@/services/SearchMovie/Search";

export async function GET(req) {
  // const url = new URL(req.url);
  // const search = url.searchParams.get("search");
  // const adult = url.searchParams.get("adult");
  try {
    const data = await getSearch();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
