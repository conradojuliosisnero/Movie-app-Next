import GetSearch from "../../../../services/search/search";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const value = url.searchParams.get("value");
  try {
    const data = await GetSearch(value);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 });
  }
}
