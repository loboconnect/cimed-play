"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Dashboard inicializado",
    "[INFO] Aguardando comando do operador",
  ]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push('/login');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const testPushNotification = async () => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Teste de Notificação',
          message: 'Esta é uma notificação de teste do sistema Synapse',
          severity: 'normal'
        })
      });

      const data = await response.json();

      if (response.ok) {
        addLog(`Notificação enviada para ${data.stats?.totalDevices || 0} dispositivos`);
      } else {
        addLog(`Erro ao enviar notificação: ${data.error}`);
      }
    } catch (err) {
      addLog('Erro ao testar notificação push');
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with user info and logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Dashboard de Transmissão</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Olá, {user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Push Notifications Section */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Notificações Push</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Status do Navegador</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-white">
                {isSupported ? 'Suportado' : 'Não suportado'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Permissão</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isPermissionGranted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-white">
                {isPermissionGranted ? 'Concedida' : 'Pendente'}
              </span>
            </div>
          </div>
        </div>

        {pushError && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
            {pushError}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          {!isPermissionGranted && isSupported && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Solicitar Permissão
            </button>
          )}

          {isPermissionGranted && (
            <button
              onClick={testPushNotification}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              🔔 Testar Notificação
            </button>
          )}
        </div>

        {fcmToken && (
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <p className="text-xs text-gray-400 mb-1">FCM Token:</p>
            <p className="text-xs text-gray-300 font-mono break-all">{fcmToken.substring(0, 50)}...</p>
          </div>
        )}
      </div>

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
