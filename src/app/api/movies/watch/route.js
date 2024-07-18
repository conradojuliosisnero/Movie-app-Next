import GetWatchVideos from "@/services/Watch/GetWatch";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    const data = await GetWatchVideos(id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
