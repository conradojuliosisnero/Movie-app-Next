import GetGenderSerie from "@/services/FilterSerie/GenderSerie/GenderSerie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await GetGenderSerie();
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
