import { neon } from "@neondatabase/serverless";

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
