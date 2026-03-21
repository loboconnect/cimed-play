"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";

export default function WatchPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [status, setStatus] = useState("Conectando...");

  const connect = useCallback(async () => {
    if (!roomId) return;
    if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null; }
    const { Peer } = await import("peerjs");
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", () => {
      setStatus("Aguardando transmissão...");
      peer.on("call", (call) => {
        call.answer();
        call.on("stream", (remoteStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream;
            videoRef.current.play().catch(() => {});
          }
          setIsConnected(true);
          setStatus("AO VIVO");
        });
        call.on("close", () => {
          setIsConnected(false);
          setStatus("Transmissão encerrada.");
        });
      });
    });

    peer.on("error", () => { setTimeout(() => connect(), 3000); });
  }, [roomId]);

  useEffect(() => {
    connect();
    return () => { if (peerRef.current) peerRef.current.destroy(); };
  }, [connect]);

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch { alert("Picture-in-Picture não suportado neste navegador"); }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <header className="px-6 py-4 bg-black border-b border-[#FFC600] flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
        <a href="/" className="px-4 py-2 bg-gray-700 rounded font-bold text-sm">Início</a>
      </header>
      <main className="p-6">
        <div className="relative bg-black rounded-lg overflow-hidden w-full mb-4" style={{aspectRatio: "16/9"}}>
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full" style={{objectFit: "contain"}} />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <div className="w-8 h-8 border-4 border-[#FFC600] border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400">{status}</span>
            </div>
          )}
          {isConnected && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-sm font-bold">AO VIVO</span>
            </div>
          )}
          {isConnected && (
            <button onClick={togglePiP} className="absolute bottom-4 right-4 px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold shadow-lg">
              {isPiP ? "🔲 Fechar Flutuante" : "🖼️ Modo Flutuante"}
            </button>
          )}
        </div>
        <div className="bg-[#2D2926] rounded-lg p-4">
          <p className="text-sm text-gray-400">{isConnected ? "Você está assistindo a transmissão ao vivo da CIMED PLAY." : status}</p>
        </div>
      </main>
    </div>
  );
}