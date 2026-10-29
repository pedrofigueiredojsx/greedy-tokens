import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/blizzard", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/blizzard")>("@/lib/blizzard");
  return { ...actual, getTokenPrice: vi.fn() };
});

vi.mock("@/lib/db", () => ({
  savePrice: vi.fn(),
}));

import { GET } from "./route";
import { getTokenPrice, REGIONS } from "@/lib/blizzard";
import { savePrice } from "@/lib/db";

const SECRET = "segredo-de-teste";

function makeRequest(authorization?: string) {
  return new NextRequest("http://localhost:3000/api/collect", {
    headers: authorization ? { authorization } : {},
  });
}

describe("GET /api/collect", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", SECRET);
    vi.mocked(getTokenPrice).mockReset();
    vi.mocked(savePrice).mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna 401 sem cabeçalho de autorização", async () => {
    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
    expect(getTokenPrice).not.toHaveBeenCalled();
    expect(savePrice).not.toHaveBeenCalled();
  });

  it("retorna 401 com segredo errado", async () => {
    const res = await GET(makeRequest("Bearer outro-segredo"));

    expect(res.status).toBe(401);
    expect(savePrice).not.toHaveBeenCalled();
  });

  it("coleta e grava todas as regiões com o segredo certo", async () => {
    vi.mocked(getTokenPrice).mockImplementation(async (region) => ({
      region,
      priceGold: 300000,
      lastUpdated: "2026-10-29T12:00:00.000Z",
    }));

    const res = await GET(makeRequest(`Bearer ${SECRET}`));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(getTokenPrice).toHaveBeenCalledTimes(REGIONS.length);
    expect(savePrice).toBeCalledTimes(REGIONS.length);
    expect(savePrice).toHaveBeenCalledWith(
      "us",
      300000,
      "2026-10-29T12:00:00.000Z",
    );
  });

  it("retorna 502 quando a Blizzard falha", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getTokenPrice).mockRejectedValue(
      new Error("blizzard fora do ar"),
    );

    const res = await GET(makeRequest(`Bearer ${SECRET}`));

    expect(res.status).toBe(502);
    expect(savePrice).not.toHaveBeenCalled();
  });

  it("retorna 401 quando CRON_secret não está configurado", async () => {
    delete process.env.CRON_SECRET;

    const res = await GET(makeRequest("Bearer undefined"));

    expect(res.status).toBe(401);
  });
});
