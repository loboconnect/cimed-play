"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [vimeoKey, setVimeoKey] = useState("");
  const [logs, setLogs] = useState<string[]>(["[INFO] CIMED PLAY Dashboard inicializado"]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<any>(null);

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

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleStartStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const newRoomId = generateRoomId();
      setRoomId(newRoomId);

      const { Peer } = await import("peerjs");
      const peer = new Peer(newRoomId);
      peerRef.current = peer;

      peer.on("call", (call) => {
        call.answer(stream);
        addLog(`Espectador conectado.`);
      });

      peer.on("open", (id) => {
        addLog(`Transmissão iniciada. Código: ${id}`);
      });

      setIsStreaming(true);
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
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setIsStreaming(false);
    setRoomId("");
    addLog("Transmissão encerrada.");
  };

  const watchUrl = roomId ? `${typeof window !== "undefined" ? window.location.origin : ""}/watch/${roomId}` : "";

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
          <div className="relative bg-black rounded-lg overflow-hidden w-full" style={{aspectRatio: "16/9"}}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full"
              style={{objectFit: "contain"}}
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-600 text-lg">OFFLINE</span>
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

        {isStreaming && roomId && (
          <div className="bg-black rounded-lg border border-green-500 p-6">
            <h2 className="text-lg font-bold text-green-400 mb-2">🔴 Transmissão Ativa</h2>
            <p className="text-sm text-gray-400 mb-3">Compartilhe este link para o público assistir:</p>
            <div className="bg-[#2D2926] p-3 rounded flex items-center justify-between gap-3">
              <span className="text-[#FFC600] font-mono text-sm break-all">{watchUrl}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(watchUrl); addLog("Link copiado!"); }}
                className="px-3 py-1 bg-[#FFC600] text-[#2D2926] font-bold rounded text-sm whitespace-nowrap"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-[#FFC600] mb-4">YouTube Live</h2>
            <div className="flex gap-3">
              <input type="text" placeholder="Chave de stream do YouTube" value={youtubeKey}
                onChange={(e) => setYoutubeKey(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#2D2926] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
              />
              <button className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">Conectar</button>
            </div>
          </div>
          <div className="bg-black rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-[#FFC600] mb-4">Vimeo Backup</h2>
            <div className="flex gap-3">
              <input type="text" placeholder="Chave de stream do Vimeo" value={vimeoKey}
                onChange={(e) => setVimeoKey(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#2D2926] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC600]"
              />
              <button className="px-5 py-2 bg-[#FFC600] text-[#2D2926] font-bold rounded hover:opacity-90">Conectar</button>
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
}      streamRef.current = stream;
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
