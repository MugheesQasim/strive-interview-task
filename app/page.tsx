import GitForm from "./form";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 text-center">
        <h1 className="text-3xl font-semibold">Submit Git Repository</h1>
        <p className="text-gray-600 mt-2">Provide the repository URL and filename to proceed</p>
      </header>

      <main className="w-full max-w-lg row-start-2">
        <GitForm />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} Strive for Startups</span>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>

  );
}
