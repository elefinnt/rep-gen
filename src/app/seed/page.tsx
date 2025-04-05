"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const seedMutation = api.seed.seedAttributes.useMutation({
    onMutate: () => {
      setIsSeeding(true);
      setResult(null);
    },
    onSuccess: (data) => {
      setResult(data);
      setIsSeeding(false);
    },
    onError: (error) => {
      setResult({ success: false, message: error.message });
      setIsSeeding(false);
    },
  });

  const handleSeedDatabase = () => {
    seedMutation.mutate();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Seed Database
        </h1>
        
        <div className="w-full max-w-md rounded-xl bg-white/10 p-6 text-center">
          <p className="mb-6">
            Click the button below to seed the database with predefined attributes.
            This will add all the positive and improvement comments to your database.
          </p>
          
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="rounded-full bg-white/20 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/30 disabled:opacity-50"
          >
            {isSeeding ? "Seeding..." : "Seed Database"}
          </button>
          
          {result && (
            <div className={`mt-6 rounded-md p-4 ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p>{result.message}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <Link
            href="/settings"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Settings
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
