import { NextResponse } from "next/server";
import getNowMovies from "@/services/Now";
import { revalidateTag } from "next/cache";

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  try {
    revalidateTag("now");
    const response = await getNowMovies(page);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
