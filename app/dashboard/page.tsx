export const dynamic = "force-dynamic"

"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { usePushNotifications } from "@/components/PushNotificationProvider";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[INFO] Dashboard inicializado"]);
  const { isSupported, isPermissionGranted, requestPermission, error: pushError } = usePushNotifications();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }
      setUser(session.user);
    });
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/login'; };
  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`]);
  const handleStartStream = () => { setIsStreaming(true); addLog("Iniciando transmissão..."); setTimeout(() => addLog("Stream ao vivo"), 2000); };
  const handleStopStream = () => { setIsStreaming(false); addLog("Transmissão encerrada"); };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Carregando...</div>;

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Synapse Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.email}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded">Sair</button>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Notificações Push</h2>
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div><span>{isSupported ? 'Suportado' : 'Não suportado'}</span></div>
          <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${isPermissionGranted ? 'bg-green-500' : 'bg-yellow-500'}`}></div><span>{isPermissionGranted ? 'Permissão concedida' : 'Pendente'}</span></div>
        </div>
        {pushError && <div className="p-3 bg-red-900 rounded text-red-200 text-sm mb-4">{pushError}</div>}
        {!isPermissionGranted && isSupported && <button onClick={requestPermission} className="px-4 py-2 bg-blue-600 rounded">Solicitar Permissão</button>}
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Status do Stream</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-4 h-4 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span>{isStreaming ? "AO VIVO" : "OFFLINE"}</span>
        </div>
        {!isStreaming
          ? <button onClick={handleStartStream} className="px-6 py-3 bg-green-600 rounded font-bold">Iniciar Transmissão</button>
          : <button onClick={handleStopStream} className="px-6 py-3 bg-red-600 rounded font-bold">Encerrar Transmissão</button>}
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Logs</h2>
        <div className="bg-black rounded p-4 h-40 overflow-y-auto font-mono text-sm">
          {logs.map((log, i) => <div key={i} className="text-gray-300">{log}</div>)}
        </div>
      </div>
    </div>
  );
}
