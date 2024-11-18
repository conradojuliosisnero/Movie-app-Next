import { NextResponse } from "next/server";
import { getSearch } from "@/services/search/search";

export async function GET(req) {
  const { search, adult } = req.query;
  try {
    const data = await getSearch(search, adult);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
