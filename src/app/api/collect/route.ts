import { NextRequest, NextResponse } from "next/server";
import { REGIONS, getTokenPrice } from "@/lib/blizzard";
import { savePrice } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (auth !== expected) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    for (const region of REGIONS) {
      const data = await getTokenPrice(region);
      await savePrice(region, data.priceGold, data.lastUpdated);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao coletar" }, { status: 502 });
  }
}
