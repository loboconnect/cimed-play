"use client";
import { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [vimeoKey, setVimeoKey] = useState("");
  const [logs, setLogs] = useState<string[]>(["[INFO] CIMED PLAY Dashboard inicializado"]);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = "/login"; return; }
      setUser(session.user);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const addLog = (msg: string) =>
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`]);

  const handleStartStream = () => { setIsStreaming(true); addLog("Transmissão iniciada."); };
  const handleStopStream = () => { setIsStreaming(false); addLog("Transmissão encerrada."); };
  const handleYoutubeConnect = () => { addLog("YouTube: tentando conectar com chave fornecida."); };
  const handleVimeoConnect = () => { addLog("Vimeo: tentando conectar com chave fornecida."); };
  const handleMobileCamera = () => { addLog("Câmera mobile: funcionalidade em breve."); };
  const handleFloatingPlayer = () => { addLog("Player flutuante: funcionalidade em breve."); };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D2926] text-[#FFC600] text-xl">
      Carregando...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2D2926] text-white">

      {/* Header */}
      <header className="bg-black px-6 py-4 flex justify-between items-center border-b border-[#FFC600]">
        <h1 className="text-2xl font-bold text-[#FFC600] tracking-widest">CIMED PLAY</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">

        {/* Stream Status */}
        <div className="bg-black rounded-lg border border-[#FFC600] p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Status do Stream</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-4 h-4 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="font-bold text-lg">{isStreaming ? "AO VIVO" : "OFFLINE"}</span>
          </div>
          {!isStreaming
            ? <button onClick={handleStartStream} className="px-6 py-3 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">
                Iniciar Transmissão
              </button>
            : <button onClick={handleStopStream} className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:opacity-90">
                Encerrar Transmissão
              </button>
          }
        </div>

        {/* YouTube Live */}
        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">YouTube Live</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Chave de stream do YouTube"
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#2D2926] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
            />
            <button
              onClick={handleYoutubeConnect}
              className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90"
            >
              Conectar
            </button>
          </div>
        </div>

        {/* Vimeo Backup */}
        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Vimeo Backup</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Chave de stream do Vimeo"
              value={vimeoKey}
              onChange={(e) => setVimeoKey(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#2D2926] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
            />
            <button
              onClick={handleVimeoConnect}
              className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90"
            >
              Conectar
            </button>
          </div>
        </div>

        {/* Mobile Camera */}
        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Câmera Mobile</h2>
          <p className="text-gray-400 text-sm mb-4">Use seu celular como fonte de transmissão.</p>
          <button
            onClick={handleMobileCamera}
            className="px-6 py-3 border border-[#FFC600] text-[#FFC600] font-bold rounded hover:bg-[#FFC600] hover:text-[#2D2926] transition-colors"
          >
            Ativar Câmera Mobile
          </button>
        </div>

        {/* Floating Player */}
        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Player Flutuante</h2>
          <p className="text-gray-400 text-sm mb-4">Abra o player em uma janela flutuante.</p>
          <button
            onClick={handleFloatingPlayer}
            className="px-6 py-3 border border-[#FFC600] text-[#FFC600] font-bold rounded hover:bg-[#FFC600] hover:text-[#2D2926] transition-colors"
          >
            Abrir Player Flutuante
          </button>
        </div>

        {/* Logs */}
        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Logs</h2>
          <div className="bg-[#2D2926] rounded p-4 h-40 overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => <div key={i} className="text-gray-300">{log}</div>)}
          </div>
        </div>

        {/* Operations Center Link */}
        <div className="text-center">
          <a
            href="/dashboard/operations"
            className="inline-block px-6 py-3 border border-[#FFC600] text-[#FFC600] font-bold rounded hover:bg-[#FFC600] hover:text-[#2D2926] transition-colors"
          >
            Acessar Centro de Operações
          </a>
        </div>

      </main>
    </div>
  );
}
