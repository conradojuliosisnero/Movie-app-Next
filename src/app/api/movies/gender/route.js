import GetGenderFiltered from "../../../../services/FilterMovie/FilterGender";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url); // URL { href: 'http://localhost:3000
  const page = url.searchParams.get("page"); // page=1
  const valueGender = url.searchParams.get("valueGender"); // valueGender=28
  try {
    const data = await GetGenderFiltered(page, valueGender);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 });
  }
}
