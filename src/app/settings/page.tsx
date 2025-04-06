"use client";

import Link from "next/link";
import { StudentManager } from "~/app/_components/student-manager";
import { AttributeManager } from "~/app/_components/attribute-manager";

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>

        <div className="flex w-full flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/2">
            <StudentManager />
          </div>

          <div className="w-full md:w-1/2">
            <AttributeManager />
          </div>
        </div>

        <Link
          href="/"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
