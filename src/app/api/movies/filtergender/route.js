import GetGenderFiltered from "../../../../services/FilterMovie/FilterGender";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url); 
  const page = url.searchParams.get("page"); 
  const valueGender = url.searchParams.get("valueGender"); 
  try {
    const data = await GetGenderFiltered(page, valueGender);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ status: 500 },{message: "Internal Server Error"});
  }
}
