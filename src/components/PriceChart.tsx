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

  return (
    <>
      <div>
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{ fontWeight: r === range ? "bold" : "normal" }}
          >
            {r}
          </button>
        ))}
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="hora" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="gold" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
