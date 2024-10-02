import { NextResponse } from "next/server";
import PersonDetails from "@/services/PersonDetails/person";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const response = await PersonDetails(id);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.error({ status: 500 });
  }
}
