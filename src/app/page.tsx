import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Report <span className="text-[#cc66ff]">Comment</span> Generator
        </h1>

        <p className="max-w-2xl text-center text-2xl">
          Create professional student report comments quickly and easily. Add
          your students, customize attributes, and generate personalized
          reports.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/generator"
          >
            <h3 className="text-2xl font-bold">Generate Reports →</h3>
            <div className="text-lg">
              Create personalized report comments for your students with just a
              few clicks.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/settings"
          >
            <h3 className="text-2xl font-bold">Settings →</h3>
            <div className="text-lg">
              Manage your students and customize the attributes used in your
              reports.
            </div>
          </Link>
          {/* <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/seed"
          >
            <h3 className="text-2xl font-bold">Seed Database →</h3>
            <div className="text-lg">
              Populate the database with predefined positive and improvement
              attributes.
            </div>
          </Link> */}
        </div>
      </div>
    </main>
  );
}
