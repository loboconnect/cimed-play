"use client";
import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraOrientation, setCameraOrientation] = useState("portrait");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [vimeoKey, setVimeoKey] = useState("");
  const [logs, setLogs] = useState(["[INFO] CIMED PLAY Dashboard inicializado"]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = "/login"; return; }
      setUser(session.user);
    });
  }, []);

  useEffect(() => {
    if (!isStreaming || !videoRef.current) return;
    const check = () => {
      const v = videoRef.current;
      if (v && v.videoWidth > 0) {
        setCameraOrientation(v.videoWidth > v.videoHeight ? "landscape" : "portrait");
      }
    };
    const interval = setInterval(check, 500);
    check();
    return () => clearInterval(interval);
  }, [isStreaming]);

  const addLog = (msg: string) =>
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`]);

  const handleStartStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsStreaming(true);
      addLog("Câmera ativada. Transmissão iniciada.");
    } catch (err) {
      addLog("Erro: permissão de câmera negada.");
    }
  };

  const handleStopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
    addLog("Transmissão encerrada.");
  };

  const mockYouTubeStream = () => {
    if (!isStreaming) { addLog("⚠️ Inicie transmissão primeiro."); return; }
    addLog("🟡 SIMULANDO envio para YouTube Live...");
    setTimeout(() => addLog("✅ Simulação concluída!"), 2000);
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <header className="mb-6 p-4 bg-[#2D2926] rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
          <p className="text-sm">Operador: {user.email}</p>
        </div>
        <button onClick={() => { supabase.auth.signOut(); window.location.href = "/login"; }} className="px-4 py-2 bg-red-600 rounded font-bold">
          Sair
        </button>
      </header>

      <div className="bg-black rounded-lg overflow-hidden relative mb-4" style={{ aspectRatio: "16/9" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: cameraOrientation === "portrait" ? "contain" : "cover",
            backgroundColor: "#000"
          }}
        />
        <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 rounded font-bold text-sm">
          {isStreaming ? "AO VIVO" : "OFFLINE"}
        </div>
        {isStreaming && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-[#FFC600] text-[#2D2926] rounded font-bold text-xs">
            {cameraOrientation === "portrait" ? "📱 Vertical" : "🔄 Horizontal"}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={handleStartStream} disabled={isStreaming} className="flex-1 px-4 py-3 bg-[#FFC600] text-[#2D2926] rounded font-bold disabled:opacity-50">
          ▶ Iniciar
        </button>
        <button onClick={handleStopStream} disabled={!isStreaming} className="flex-1 px-4 py-3 bg-red-600 text-white rounded font-bold disabled:opacity-50">
          ⏹ Parar
        </button>
      </div>

      {/* YouTube Live */}
      <div className="p-4 bg-[#2D2926] rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-2">YouTube Live</h2>
        <div className="flex gap-2 mb-2">
          <input type="text" placeholder="Chave de transmissão" value={youtubeKey} onChange={(e) => setYoutubeKey(e.target.value)} className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded text-white" />
          <button className="px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold">Conectar</button>
        </div>
        <button onClick={mockYouTubeStream} disabled={!isStreaming} className="w-full mt-3 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-bold text-white">
          📺 Enviar para YouTube (Simular)
        </button>
      </div>

      {/* Vimeo Backup - ADICIONADO AQUI ✅ */}
      <div className="p-4 bg-[#2D2926] rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-2">Vimeo Backup</h2>
        <div className="flex gap-2 mb-2">
          <input type="text" placeholder="Chave de transmissão" value={vimeoKey} onChange={(e) => setVimeoKey(e.target.value)} className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded text-white" />
          <button className="px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold">Conectar</button>
        </div>
      </div>

      {/* Logs */}
      <div className="p-4 bg-[#2D2926] rounded-lg">
        <h2 className="text-lg font-bold mb-2">Logs</h2>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {logs.map((log, i) => <p key={i} className="text-xs font-mono text-gray-300">{log}</p>)}
        </div>
      </div>
    </div>
  );
}
