import { NextResponse } from "next/server";
import getTrandingAll from "@/services/trandingAll/trandingAll";

export async function GET() {
  try {
    const data = await getTrandingAll();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
