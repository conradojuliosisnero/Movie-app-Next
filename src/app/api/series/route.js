import getSeries from "@/services/Series/GetSeries";
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url);
    const nextPage = url.searchParams.get("page");
  try {
    const response = await getSeries(nextPage);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      error,
      { status: 500 },
      { message: "Internal Server Error" }
    );
  }
}
