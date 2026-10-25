export function percentChange(first: number, last: number): number | null {
  if (!first) return null;
  return ((last - first) / first) * 100;
}

export function minMax(prices: number[]): { min: number; max: number } | null {
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
