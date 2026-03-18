"use client";
import { useState, useEffect } from "react";

export default function WatchPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPiP, setShowPiP] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  // Detectar orientação da tela (para teste de responsividade)
  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsStreaming(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePiP = async () => {
    const video = document.querySelector("video");
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setShowPiP(false);
      } else {
        await video.requestPictureInPicture();
        setShowPiP(true);
      }
    } catch (err) {
      alert("Picture-in-Picture não suportado neste navegador");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <header className="mb-6 p-4 bg-[#2D2926] rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
          <p className="text-sm">Transmissão ao Vivo • {orientation === "portrait" ? "📱 Vertical" : "🔄 Horizontal"}</p>
        </div>
        <a href="/" className="px-4 py-2 bg-gray-700 rounded font-bold">Início</a>
      </header>

      {/* Player Principal — SEMPRE RESPONSIVO */}
      <div className="bg-black rounded-lg overflow-hidden relative mb-4" style={{ aspectRatio: "16/9" }}>
        <video
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          src={isStreaming ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" : undefined}
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Aguardando transmissão...</p>
              <p className="text-sm text-gray-400 mt-2">Operador deve iniciar no Dashboard</p>
            </div>
          </div>
        )}
        {isStreaming && (
          <>
            <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 rounded font-bold text-sm">AO VIVO</div>
            
            {/* Botão Flutuante */}
            <button 
              onClick={togglePiP}
              className="absolute bottom-4 right-4 px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold shadow-lg hover:bg-yellow-400 transition"
            >
              {showPiP ? "🔲 Parar Flutuante" : "🖼️ Modo Flutuante"}
            </button>
          </>
        )}
      </div>

      {/* Informações Técnicas */}
      <div className="p-4 bg-[#2D2926] rounded-lg">
        <h2 className="text-lg font-bold mb-2">Detalhes</h2>
        <p className="text-sm text-gray-400">WebRTC • Qualidade adaptativa • Funciona em Android/iOS/PC</p>
        <p className="text-xs text-gray-500 mt-2">Para tirar print ou mostrar: gire seu celular entre vertical e horizontal</p>
      </div>
    </div>
  );
}
