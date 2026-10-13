export const REGIONS = ["us", "eu", "kr", "tw"] as const;

export type Region = (typeof REGIONS)[number];

export function isRegion(value: string | null): value is Region {
  return REGIONS.includes(value as Region);
}

let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;

  const id = process.env.BLIZZARD_CLIENT_ID;
  const secret = process.env.BLIZZARD_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Credenciais da Blizzard ausentes");

  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Falha no OAuth: ${res.status}`);

  const data = await res.json();
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cached.token;
}

export async function getTokenPrice(region: Region) {
  const accessToken = await getAccessToken();

  const url = `https://${region}.api.blizzard.com/data/wow/token/index?namespace=dynamic-${region}&locale=en_US`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("URL chamada:", url);
    console.error("Resposta da Blizzard:", body);
    throw new Error(`Falha na API do token: ${res.status}`);
  }

  const data = await res.json();
  return {
    region,
    priceGold: Math.round(data.price / 10000),
    lastUpdated: new Date(data.last_updated_timestamp).toISOString(),
  };
}
