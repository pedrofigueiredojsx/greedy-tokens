import TokenPrice from "@/components/TokenPrice";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-zinc-950 p-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Greedy Tokens</h1>
      <TokenPrice />
    </main>
  );
}
