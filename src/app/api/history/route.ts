import { isRegion } from "@/lib/blizzard";
import { getHistory } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const RANGE_HOURS = {
  "24h": 24,
  "7d": 168,
  "30d": 720,
} as const;

type Range = keyof typeof RANGE_HOURS;

function isRange(value: string): value is Range {
  return value in RANGE_HOURS;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const region = params.get("region") ?? "us";
  const range = params.get("range") ?? "24h";

  if (!isRegion(region)) {
    return NextResponse.json(
      { error: "Região inválida" },
      {
        status: 400,
      },
    );
  }

  if (!isRange(range)) {
    return NextResponse.json({ error: "Período inválido" }, { status: 400 });
  }

  try {
    const points = await getHistory(region, RANGE_HOURS[range]);
    return NextResponse.json({ region, range, points });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico" },
      { status: 502 },
    );
  }
}
