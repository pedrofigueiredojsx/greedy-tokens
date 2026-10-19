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
    <div>
      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r.toUpperCase()}
          </option>
        ))}
      </select>

      <p>
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
