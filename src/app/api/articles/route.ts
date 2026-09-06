import { NextResponse } from "next/server";
import { getPublishedArticles } from "@/lib/data";

export async function GET() {
  const articles = await getPublishedArticles(30);
  return NextResponse.json({ articles });
}
