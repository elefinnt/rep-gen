import Link from "next/link";
import { ReportGenerator } from "~/app/_components/report-generator";

export default function GeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Report Generator
        </h1>

        <ReportGenerator />

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
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
