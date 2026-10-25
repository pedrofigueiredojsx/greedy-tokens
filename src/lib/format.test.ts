import { describe, it, expect } from "vitest";
import { timeAgo } from "./format";

const NOW = new Date("2026-10-24T12:00:00Z").getTime();

describe("timeAgo", () => {
  it("retorna 'agora mesmo' para menos de 1 minuto", () => {
    expect(timeAgo("2026-10-24T11:59:30Z", NOW)).toBe("agora mesmo");
  });

  it("retorna minutos", () => {
    expect(timeAgo("2026-10-24T11:45:00Z", NOW)).toBe("há 15 min");
  });

  it("retorna horas", () => {
    expect(timeAgo("2026-10-24T09:00:00Z", NOW)).toBe("há 3 h");
  });

  it("retorna dias", () => {
    expect(timeAgo("2026-10-22T12:00:00Z", NOW)).toBe("há 2 d");
  });
});
