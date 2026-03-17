import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <main className="w-full max-w-md text-center px-6 py-32">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Decide
        </h1>
        <p className="text-lg text-gray-500 mt-4 mb-8">
          Prenez des décisions éclairées, ensemble.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/register"
            className="flex items-center justify-center h-12 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Commencer
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center justify-center h-12 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </main>
    </div>
  );
}
