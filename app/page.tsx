import OptionsBox from "./options";

export default function Home() {
  return (
    <div className="grid place-items-center justify-items-center min-h-screen p-8 pb-20 gap-2 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 text-center">
        <h1 className="text-3xl font-semibold">Code Quality Analyzer</h1>
      </header>
      <main className="w-full max-w-lg">
        <OptionsBox />
      </main>

      <footer className="row-start-5 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} Strive for Startups</span>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>

  );
}
