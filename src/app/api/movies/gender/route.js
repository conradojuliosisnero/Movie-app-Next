import GetGender from "../../../../services/FilterMovie/GeneroMovie/Gender";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await GetGender();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error(
      { status: 500 },
      { message: "Internal Server Error" }
    );
  }
}
