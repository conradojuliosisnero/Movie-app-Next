import GetSearchSeries from "@/services/SearchSeries/Search";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const value = url.searchParams.get("value");
  try {
    const response = await GetSearchSeries(value);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
