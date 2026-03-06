import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Painel de Controle
          </h1>
          <p className="text-xl text-gray-400">
            Sistema de Transmissão Digital - Campanha 2026
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Ir para Dashboard
          </Link>
        </div>

        <div className="text-sm text-gray-500 pt-8">
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
