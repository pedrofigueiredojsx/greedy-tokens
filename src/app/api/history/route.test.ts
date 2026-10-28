import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  getHistory: vi.fn(),
}));

import { GET } from "./route";
import { getHistory } from "@/lib/db";

function makeRequest(query: string) {
  return new NextRequest(`http://localhost:3000/api/history${query}`);
}

describe("GET /api/history", () => {
  beforeEach(() => {
    vi.mocked(getHistory).mockReset();
  });

  it("retorna 400 para região inválida", async () => {
    const res = await GET(makeRequest("?region=banana"));
    expect(res.status).toBe(400);
  });

  it("retorna 400 para período inválido", async () => {
    const res = await GET(makeRequest("?region=us&range=banana"));
    expect(res.status).toBe(400);
  });

  it("usa us e 24h como padrão", async () => {
    vi.mocked(getHistory).mockResolvedValue([]);

    const res = await GET(makeRequest(""));

    expect(res.status).toBe(200);
    expect(getHistory).toHaveBeenCalledWith("us", 24);
  });

  it("converte 7d em 168 horas e devolve os pontos", async () => {
    const points = [{ priceGold: 300000, at: "2026-10-28T12:00:00.000Z" }];
    vi.mocked(getHistory).mockResolvedValue(points);

    const res = await GET(makeRequest("?region=eu&range=7d"));

    expect(getHistory).toHaveBeenCalledWith("eu", 168);
    expect(await res.json()).toEqual({ region: "eu", range: "7d", points });
  });

  it("retorna 502 quando o banco falha", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getHistory).mockRejectedValue(new Error("banco fora do ar"));

    const res = await GET(makeRequest("?region=us&range=24h"));

    expect(res.status).toBe(502);
  });
});
