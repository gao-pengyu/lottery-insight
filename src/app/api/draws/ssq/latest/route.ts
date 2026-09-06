import { NextResponse } from "next/server";
import { getLatestSsqDraw } from "@/lib/data";

export async function GET() {
  const draw = await getLatestSsqDraw();
  return NextResponse.json({ draw });
}
