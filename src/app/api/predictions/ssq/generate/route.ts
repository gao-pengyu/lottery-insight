import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSsqPredictions } from "@/lib/prediction";
import { getSsqDrawsAscending } from "@/lib/data";

const schema = z.object({
  mode: z.enum(["random", "hot", "cold", "mixed", "custom"]).default("mixed"),
  count: z.number().int().min(1).max(20).default(5),
  historyWindow: z.number().int().min(5).max(300).default(100),
  constraints: z
    .object({
      mustIncludeRed: z.array(z.number()).optional(),
      excludeRed: z.array(z.number()).optional(),
      mustIncludeBlue: z.array(z.number()).optional(),
      excludeBlue: z.array(z.number()).optional(),
      sumRange: z.tuple([z.number(), z.number()]).optional(),
      oddEvenRatio: z.array(z.string()).optional(),
      bigSmallRatio: z.array(z.string()).optional(),
      allowConsecutive: z.boolean().optional(),
      allowRepeatFromLastDraw: z.boolean().optional()
    })
    .optional()
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const draws = await getSsqDrawsAscending(body.historyWindow);
    const results = generateSsqPredictions(draws, { ...body, seed: Date.now() });
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
