"use client";
import { useState, useEffect } from "react";

export default function WatchPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPiP, setShowPiP] = useState(false);

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
        <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
        <a href="/" className="px-4 py-2 bg-gray-700 rounded font-bold">Início</a>
      </header>

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
            <p>Aguardando transmissão...</p>
          </div>
        )}
        {isStreaming && (
          <>
            <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 rounded font-bold text-sm">AO VIVO</div>
            <button 
              onClick={togglePiP}
              className="absolute bottom-4 right-4 px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold"
            >
              {showPiP ? "Parar Flutuante" : "Modo Flutuante"}
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <a href="https://youtube.com" target="_blank" className="p-4 bg-[#2D2926] rounded-lg text-center">
          <p className="font-bold">▶ YouTube</p>
        </a>
        <a href="https://vimeo.com" target="_blank" className="p-4 bg-[#2D2926] rounded-lg text-center">
          <p className="font-bold">▶ Vimeo</p>
        </a>
      </div>
    </div>
  );
}
