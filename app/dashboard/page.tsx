"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { usePushNotifications } from "@/components/PushNotificationProvider";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[INFO] Dashboard inicializado","[INFO] Aguardando comando do operador"]);
  const { isSupported, isPermissionGranted, fcmToken, requestPermission, error: pushError } = usePushNotifications();

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
    });
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/login'; };
  const addLog = (message: string) => { const t = new Date().toLocaleTimeString("pt-BR"); setLogs(prev => [...prev, `[${t}] ${message}`]); };
  const handleStartStream = () => { setIsStreaming(true); addLog("Iniciando transmissão..."); setTimeout(() => { addLog("Conexão estabelecida com YouTube"); addLog("Stream ao vivo"); }, 2000); };
  const handleStopStream = () => { setIsStreaming(false); addLog("Encerrando transmissão..."); };

  const testPushNotification = async () => {
    const response = await fetch('/api/notifications/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Teste Synapse', message: 'Notificação de teste', data: {} }) });
    const data = await response.json();
    addLog(response.ok ? `Notificação enviada` : `Erro: ${data.error}`);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="text-white">Carregando...</div></div>;

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Synapse Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{user.email}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Sair</button>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Notificações Push</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-white text-sm">{isSupported ? 'Suportado' : 'Não suportado'}</span></div>
          <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${isPermissionGranted ? 'bg-green-500' : 'bg-yellow-500'}`}></div><span className="text-white text-sm">{isPermissionGranted ? 'Permissão concedida' : 'Pendente'}</span></div>
        </div>
        {pushError && <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">{pushError}</div>}
        <div className="flex gap-4 mt-4">
          {!isPermissionGranted && isSupported && <button onClick={requestPermission} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Solicitar Permissão</button>}
          {isPermissionGranted && <button onClick={testPushNotification} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">🔔 Testar Notificação</button>}
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Status do Stream</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-4 h-4 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-white text-lg">{isStreaming ? "TRANSMISSÃO AO VIVO" : "OFFLINE"}</span>
        </div>
        {!isStreaming ? <button onClick={handleStartStream} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Iniciar Transmissão</button> : <button onClick={handleStopStream} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Encerrar Transmissão</button>}
      </div>
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Logs do Sistema</h2>
        <div className="bg-black rounded border border-gray-700 p-4 h-48 overflow-y-auto font-mono text-sm space-y-1">
          {logs.map((log, idx) => <div key={idx} className={log.includes("ERROR") ? "text-red-400" : log.includes("SUCESSO") ? "text-green-400" : "text-gray-300"}>{log}</div>)}
        </div>
      </div>
    </div>
  );
}
