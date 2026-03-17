import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D2926]">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#FFC600] tracking-widest">
            CIMED PLAY
          </h1>
          <p className="text-xl text-gray-400">
            Plataforma de Entretenimento Esportivo e Streaming Digital
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-[#FFC600] hover:opacity-90 text-[#2D2926] rounded-lg font-bold transition-opacity"
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
