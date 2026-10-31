import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/blizzard", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/blizzard")>("@/lib/blizzard");
  return { ...actual, getTokenPrice: vi.fn() };
});

import { GET } from "./route";
import { getTokenPrice } from "@/lib/blizzard";
import { lazyPostCSS } from "next/dist/build/webpack/config/blocks/css";

function makeRequest(query: string) {
  return new NextRequest(`http://localhost:3000/api/token${query}`);
}

describe("GET /api/token", () => {
  beforeEach(() => {
    vi.mocked(getTokenPrice).mockReset();
  });

  it("retorna 400 para região inválida", async () => {
    const res = await GET(makeRequest("?region=banana"));

    expect(res.status).toBe(400);
    expect(getTokenPrice).not.toHaveBeenCalled();
  });

  it("usa us como região padrão", async () => {
    vi.mocked(getTokenPrice).mockResolvedValue({
      region: "us",
      priceGold: 300000,
      lastUpdated: "2026-10-30T12:00:00.000Z",
    });

    const res = await GET(makeRequest(""));
    expect(res.status).toBe(200);
    expect(getTokenPrice).toHaveBeenCalledWith("us");
  });

  it("devolve o preço da região pedida", async () => {
    const data = {
      region: "eu" as const,
      priceGold: 250000,
      lastUpdated: "2026-10-30T12:00:00.000Z",
    };
    vi.mocked(getTokenPrice).mockResolvedValue(data);

    const res = await GET(makeRequest("?region=eu"));

    expect(await res.json()).toEqual(data);
  });

  it("retorna 502 quando a Blizzard falha", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getTokenPrice).mockRejectedValue(
      new Error("blizzard fora do ar"),
    );

    const res = await GET(makeRequest("?region=us"));

    expect(res.status).toBe(502);
  });
});
