"use client";
import { useEffect, useState } from "react";
import PriceChart from "./PriceChart";

const REGIONS = ["us", "eu", "kr", "tw"];

type TokenData = {
  region: string;
  priceGold: number;
  lastUpdated: string;
};

export default function TokenPrice() {
  const [region, setRegion] = useState("us");
  const [data, setData] = useState<TokenData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);

    fetch(`/api/token?region=${region}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar o token");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [region]);

  return (
    <div className="rounded-2x1 border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">Preço atual do token</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-100"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-4xl font-bold text-amber-400">
        {error
          ? "Não foi possível carregar o preço"
          : data
            ? `${data.priceGold.toLocaleString("pt-BR")} gold`
            : "Carregando..."}
      </p>
      <PriceChart region={region} />
    </div>
  );
}
