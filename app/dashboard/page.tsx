"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [vimeoKey, setVimeoKey] = useState("");
  const [logs, setLogs] = useState<string[]>(["[INFO] CIMED PLAY Dashboard inicializado"]);
  const [orientation, setOrientation] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    const handleOrientation = () => {
      const angle = (screen.orientation?.angle) ?? window.orientation ?? 0;
      setOrientation(Number(angle));
    };
    handleOrientation();
    window.addEventListener("orientationchange", handleOrientation);
    screen.orientation?.addEventListener("change", handleOrientation);
    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
      screen.orientation?.removeEventListener("change", handleOrientation);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const addLog = (msg: string) =>
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`]);

  const handleStartStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      addLog("Câmera ativada. Transmissão iniciada.");
    } catch (err) {
      addLog("Erro: permissão de câmera negada ou não disponível.");
    }
  };

  const handleStopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    addLog("Transmissão encerrada.");
  };

  const handleYoutubeConnect = () => { addLog("YouTube: integração em breve."); };
  const handleVimeoConnect = () => { addLog("Vimeo: integração em breve."); };

  const getVideoTransform = () => {
    if (orientation === 90 || orientation === -90 || orientation === 270) return "rotate(90deg)";
    if (orientation === 180) return "rotate(180deg)";
    return "rotate(0deg)";
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D2926] text-[#FFC600] text-xl">
      Carregando...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2D2926] text-white">
      <header className="bg-black px-6 py-4 flex justify-between items-center border-b border-[#FFC600]">
        <h1 className="text-2xl font-bold text-[#FFC600] tracking-widest">CIMED PLAY</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.email}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">
            Sair
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">

        <div className="bg-black rounded-lg border border-[#FFC600] p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Monitor PGM</h2>
          <div className="relative bg-[#2D2926] rounded-lg overflow-hidden" style={{aspectRatio: "16/9"}}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full"
              style={{objectFit: "cover", transform: getVideoTransform(), transition: "transform 0.3s ease"}}
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 text-lg">OFFLINE</span>
              </div>
            )}
            {isStreaming && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm font-bold">AO VIVO</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-4">
            {!isStreaming ? (
              <button onClick={handleStartStream} className="px-6 py-3 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">
                ▶ Iniciar Transmissão
              </button>
            ) : (
              <button onClick={handleStopStream} className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:opacity-90">
                ⏹ Encerrar Transmissão
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <button onClick={handleYoutubeConnect} className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">
                Conectar
              </button>
            </div>
          </div>

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
              <button onClick={handleVimeoConnect} className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">
                Conectar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-[#FFC600] mb-4">Logs</h2>
          <div className="bg-[#2D2926] rounded p-4 h-40 overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => <div key={i} className="text-gray-300">{log}</div>)}
          </div>
        </div>

        <div className="text-center">
          <a href="/dashboard/operations" className="inline-block px-6 py-3 border border-[#FFC600] text-[#FFC600] font-bold rounded hover:bg-[#FFC600] hover:text-[#2D2926] transition-colors">
            Acessar Centro de Operações
          </a>
        </div>

      </main>
    </div>
  );
}
