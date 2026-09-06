import { NextResponse } from "next/server";
import { refreshSsqData } from "@/lib/crawler";

export async function POST() {
  const result = await refreshSsqData();
  return NextResponse.json(result);
}
