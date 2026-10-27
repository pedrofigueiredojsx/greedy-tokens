import { describe, it, expect } from "vitest";
import { percentChange, minMax } from "./stats";

describe("percentChange", () => {
  it("calcula um alta", () => {
    expect(percentChange(100, 110)).toBe(10);
  });

  it("calcula um queda", () => {
    expect(percentChange(200, 150)).toBe(-25);
  });

  it("retorna 0 quando o preço não muda", () => {
    expect(percentChange(100, 100)).toBe(0);
  });

  it("retorna null quando o primeiro preço é 0", () => {
    expect(percentChange(0, 100)).toBeNull();
  });

  describe("minmax", () => {
    it("acha o mínimo e o máximo", () => {
      expect(minMax([300, 100, 200])).toEqual({ min: 100, max: 300 });
    });

    it("funciona com um único preço", () => {
      expect(minMax([150])).toEqual({ min: 150, max: 150 });
    });

    it("retorna null para lista vazia", () => {
      expect(minMax([])).toBeNull();
    });

    it("retorna null para lista vazia", () => {
      expect(minMax([0])).toBeFalsy();
    });
  });
});
