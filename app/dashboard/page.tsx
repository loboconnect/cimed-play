"use client";

import { useState } from "react";

export default function Dashboard() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Dashboard inicializado",
    "[INFO] Aguardando comando do operador",
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-BR");
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    addLog("Iniciando transmissão...");
    setTimeout(() => {
      addLog("Conexão estabelecida com YouTube");
      addLog("Conexão estabelecida com Vimeo");
      addLog("Stream ao vivo");
    }, 2000);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    addLog("Encerrando transmissão...");
    setTimeout(() => {
      addLog("Transmissão encerrada");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Dashboard de Transmissão</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status do Stream */}
        <div className="lg:col-span-2 bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">Status do Stream</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="text-lg">
                {isStreaming ? "TRANSMISSÃO AO VIVO" : "OFFLINE"}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">YouTube Principal</p>
              <div className="w-full h-2 bg-gray-800 rounded">
                <div
                  className={`h-full bg-red-600 rounded transition-all duration-300 ${
                    isStreaming ? "w-full" : "w-0"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Vimeo Backup</p>
              <div className="w-full h-2 bg-gray-800 rounded">
                <div
                  className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                    isStreaming ? "w-full" : "w-0"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {!isStreaming ? (
              <button
                onClick={handleStartStream}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Iniciar Transmissão
              </button>
            ) : (
              <button
                onClick={handleStopStream}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Encerrar Transmissão
              </button>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
          <h3 className="text-xl font-semibold text-white">Informações</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400">Resolução</p>
              <p className="text-white">1920x1080</p>
            </div>
            <div>
              <p className="text-gray-400">Taxa de Bits</p>
              <p className="text-white">5000 kbps</p>
            </div>
            <div>
              <p className="text-gray-400">Espectadores</p>
              <p className="text-white">0 (offline)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Logs do Sistema</h2>
        <div className="bg-black rounded border border-gray-700 p-4 h-48 overflow-y-auto font-mono text-sm space-y-1">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={
                log.includes("ERROR")
                  ? "text-red-400"
                  : log.includes("SUCESSO")
                    ? "text-green-400"
                    : "text-gray-300"
              }
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
