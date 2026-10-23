"use client";
import { useEffect, useState } from "react";
import PriceChart from "./PriceChart";

const REGIONS = ["us", "eu", "kr", "tw"];

type TokenData = {
  region: string;
  priceGold: number;
  lastUpdated: string;
};

function timeAgo(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  return `há ${Math.floor(hours / 24)} d`;
}

export default function TokenPrice() {
  const [region, setRegion] = useState("us");
  const [data, setData] = useState<TokenData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`/api/token?region=${region}`);
        if (!res.ok) throw new Error("Falha ao buscar o token");
        const json = await res.json();

        if (active) {
          setData(json);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }
    setData(null);
    setError(false);
    load();

    const id = setInterval(load, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(id);
    };
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
      {data && (
        <p className="mt-1 text-xs text-zinc-500">
          Atualizado {timeAgo(data.lastUpdated)}
        </p>
      )}
      <PriceChart region={region} />
    </div>
  );
}
