"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [vimeoKey, setVimeoKey] = useState("");
  const [logs, setLogs] = useState(["[INFO] CIMED PLAY Dashboard inicializado"]);
  const [cameraOrientation, setCameraOrientation] = useState("portrait");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    supabase.auth.getSession().then(({  { session } }) => {
      if (!session) { window.location.href = "/login"; return; }
      setUser(session.user);
    });
  }, [supabase]);

  useEffect(() => {
    if (!isStreaming || !streamRef.current) return;
    
    const checkCameraOrientation = () => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return;
      
      if (video.videoWidth > video.videoHeight) {
        setCameraOrientation("landscape");
      } else {
        setCameraOrientation("portrait");
      }
    };

    const interval = setInterval(checkCameraOrientation, 500);
    checkCameraOrientation();
    
    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (!isStreaming) return;
    const handleOrientationChange = async () => {
      await new Promise(r => setTimeout(r, 500));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {}
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    screen.orientation?.addEventListener("change", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      screen.orientation?.removeEventListener("change", handleOrientationChange);
    };
  }, [isStreaming]);

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
      if (videoRef.current) videoRef.current.srcObject = stream;
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
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
    addLog("Transmissão encerrada.");
  };

  const handleYoutubeConnect = () => { addLog("YouTube: integração em breve."); };
  const handleVimeoConnect = () => { addLog("Vimeo: integração em breve."); };
  const mockYouTubeStream = () => {
    if (!isStreaming) { addLog("YouTube: ⚠️ Inicie a transmissão primeiro."); return; }
    addLog("YouTube: 🟡 SIMULANDO transmissão para YouTube Live...");
    setTimeout(() => addLog("YouTube: ✅ Transmissão simulada com sucesso!"), 2000);
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <header className="mb-6 p-4 bg-[#2D2926] rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
          <p className="text-sm">Operador: {user.email}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded font-bold">
          Sair
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-black rounded-lg overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
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
              {cameraOrientation === "portrait" ? "📱 9:16" : "🔄 16:9"}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStartStream}
            disabled={isStreaming}
            className="flex-1 px-4 py-3 bg-[#FFC600] text-[#2D2926] rounded font-bold disabled:opacity-50"
          >
            ▶ Iniciar Transmissão
          </button>
          <button
            onClick={handleStopStream}
            disabled={!isStreaming}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded font-bold disabled:opacity-50"
          >
            ⏹ Encerrar Transmissão
          </button>
        </div>

        <div className="p-4 bg-[#2D2926] rounded-lg">
          <h2 className="text-lg font-bold mb-2">## YouTube Live</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chave de transmissão"
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
            />
            <button
              onClick={handleYoutubeConnect}
              className="px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold"
            >
              Conectar
            </button>
          </div>
          <button
            onClick={mockYouTubeStream}
            disabled={!isStreaming}
            className="w-full mt-3 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-bold text-white transition"
          >
            📺 Enviar para YouTube Live (Simular)
          </button>
        </div>

        <div className="p-4 bg-[#2D2926] rounded-lg">
          <h2 className="text-lg font-bold mb-2">## Vimeo Backup</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chave de transmissão"
              value={vimeoKey}
              onChange={(e) => setVimeoKey(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
            />
            <button
              onClick={handleVimeoConnect}
              className="px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold"
            >
              Conectar
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#2D2926] rounded-lg">
          <h2 className="text-lg font-bold mb-2">## Logs</h2>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className="text-xs font-mono text-gray-300">{log}</p>
            ))}
          </div>
        </div>

        <a href="/dashboard/operations" className="block text-center px-4 py-3 bg-[#FFC600] text-[#2D2926] rounded font-bold">
          Acessar Centro de Operações →
        </a>
      </div>
    </div>
  );
}
