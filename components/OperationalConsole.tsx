'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface OperationalCommand {
  id: string
  command_type: string
  payload: any
  issued_by: string
  status: string
  created_at: string
}

export default function OperationalConsole() {
  const [commands, setCommands] = useState<OperationalCommand[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const { data, error } = await supabase
          .from('operational_commands')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        if (error) { console.error('Erro:', error); return }
        setCommands(data || [])
      } catch (err) {
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommands()

    const channel = supabase
      .channel('operational_commands_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'operational_commands' },
        (payload) => {
          setCommands(prev => [payload.new as OperationalCommand, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const getCommandColor = (commandType: string) => {
    switch (commandType) {
      case 'START_OPERATION': return 'text-green-400 bg-green-900'
      case 'STOP_OPERATION': return 'text-yellow-400 bg-yellow-900'
      case 'TRIGGER_EFFECT': return 'text-blue-400 bg-blue-900'
      case 'LOCK_SYSTEM': return 'text-orange-400 bg-orange-900'
      case 'EMERGENCY_STOP': return 'text-red-400 bg-red-900'
      default: return 'text-gray-400 bg-gray-700'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-semibold mb-4">Console Operacional</h2>
        <div className="text-center text-gray-400">Carregando comandos...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-2xl font-semibold mb-6">Console Operacional</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {commands.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Nenhum comando registrado ainda.</div>
        ) : (
          commands.map((command) => (
            <div key={command.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCommandColor(command.command_type)}`}>
                    {command.command_type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-400">{formatTimestamp(command.created_at)}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  command.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                  command.status === 'executed' ? 'bg-green-900 text-green-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {command.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <strong>Operador:</strong> {command.issued_by}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">🔴 LIVE - Recebendo comandos em tempo real</div>
    </div>
  )
}
