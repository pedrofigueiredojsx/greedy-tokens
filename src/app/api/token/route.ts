import { NextRequest, NextResponse } from "next/server";
import { getTokenPrice, isRegion } from "@/lib/blizzard";

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") ?? "us";

  if (!isRegion(region)) {
    return NextResponse.json({ error: "Região inválida" }, { status: 400 });
  }

  try {
    const data = await getTokenPrice(region);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar o token" },
      { status: 502 },
    );
  }
}
