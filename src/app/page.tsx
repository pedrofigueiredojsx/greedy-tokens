import TokenPrice from "@/components/TokenPrice";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 bg-zinc-950 p-6 text-zinc-100">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl sm:text-5xl">🪙</span>
          <h1 className="bg-linear-to-r from-amber-300 to-yellow-500 bg-clip-text pb-1 text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl">
            Greedy Tokens
          </h1>
        </div>
        <p className="text-sm text-zinc-400">
          Preço do WoW Token por região, atualizado a cada ~20 minutos
        </p>
      </header>
      <TokenPrice />
    </main>
  );
}
