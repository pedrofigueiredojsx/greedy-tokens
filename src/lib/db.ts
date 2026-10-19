import { neon } from "@neondatabase/serverless";
import { Rowdies } from "next/font/google";

const sql = neon(process.env.DATABASE_URL!);

export async function savePrice(
  region: string,
  priceGold: number,
  blizzardUpdatedAt: string,
) {
  await sql`
        INSERT INTO token_prices (region, price_gold, blizzard_updated_at)
        VALUES (${region}, ${priceGold}, ${blizzardUpdatedAt})
        ON CONFLICT (region, blizzard_updated_at) DO NOTHING
    `;
}

export type PricePoint = {
  priceGold: number;
  at: string;
};

export async function getHistory(
  region: string,
  hours: number,
): Promise<PricePoint[]> {
  const rows = await sql`
  SELECT price_gold, blizzard_updated_at
  FROM token_prices
  WHERE region = ${region}
    AND blizzard_updated_at > NOW() - make_interval(hours => ${hours})
  ORDER BY blizzard_updated_at ASC`;

  return rows.map((row) => ({
    priceGold: row.price_gold,
    at: new Date(row.blizzard_updated_at).toISOString(),
  }));
}
