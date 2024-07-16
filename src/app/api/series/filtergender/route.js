import FilterGenderSerie from "@/services/FilterSerie/FilterGenderSerie";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const value = url.searchParams.get("value");
  const page = url.searchParams.get("page");
  try {
    const response = await FilterGenderSerie(page,value);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
