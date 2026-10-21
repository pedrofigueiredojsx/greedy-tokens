"use cliente";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RANGES = ["24h", "7d", "30d"];
type Range = (typeof RANGES)[number];

type Point = {
  priceGold: number;
  at: string;
};

export default function PriceChart({ region }: { region: string }) {
  const [points, setPoints] = useState<Point[]>([]);
  const [range, setRange] = useState<Range>("24h");

  useEffect(() => {
    fetch(`/api/history?region=${region}&range=${range}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar histórico");
        return res.json();
      })
      .then((json) => setPoints(json.points))
      .catch(() => setPoints([]));
  }, [region, range]);

  const chartData = points.map((p) => ({
    hora:
      range === "24h"
        ? new Date(p.at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(p.at).toLocaleTimeString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
    gold: p.priceGold,
  }));

  const first = points[0]?.priceGold;
  const last = points[points.length - 1]?.priceGold;

  const change = first && last ? ((last - first) / first) * 100 : null;

  return (
    <>
      <div className="mt-2 flex gap-2">
        {change !== null && (
          <p
            className={`mt-6 text-sm font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}% nas últimas{" "}
            {range}
          </p>
        )}
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded=lg px-3 py-1 text-sm font-medium transition ${r === range ? "bg-amber-400 text-zinc-900" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
          >
            {r}
          </button>
        ))}
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="hora" stroke="#71717a" tick={{ fontSize: 12 }} />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#71717a"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1818b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="gold"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
