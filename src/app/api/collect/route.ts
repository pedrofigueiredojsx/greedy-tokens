import { NextRequest, NextResponse } from "next/server";
import { REGIONS, getTokenPrice } from "@/lib/blizzard";
import { savePrice } from "@/lib/db";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
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
