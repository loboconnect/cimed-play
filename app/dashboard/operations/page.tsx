'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import OperationalConsole from '@/components/OperationalConsole'

type CommandType = 'START_OPERATION' | 'STOP_OPERATION' | 'TRIGGER_EFFECT' | 'LOCK_SYSTEM' | 'EMERGENCY_STOP'

export default function OperationsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single()
      if (userData?.role && ['operator', 'admin'].includes(userData.role)) {
        setUserRole(userData.role)
      } else {
        router.push('/dashboard')
      }
    }
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) { router.push('/login') }
    })
    return () => subscription.unsubscribe()
  }, [router])

  const sendCommand = async (commandType: CommandType, payload: any = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandType, payload })
      })
      const data = await response.json()
      if (!response.ok) { throw new Error(data.error || 'Erro ao enviar comando') }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Verificando permissões...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Centro de Operações Synapse</h1>
          <p className="text-gray-400 mt-2">Operador: {user.email} | Role: {userRole}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
            ← Voltar ao Dashboard
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
            Sair
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">Comando Operacional</h2>
            {error && <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">{error}</div>}
            <div className="space-y-4">
              <button onClick={() => sendCommand('START_OPERATION')} disabled={loading} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors">
                {loading ? 'Enviando...' : '▶️ START OPERATION'}
              </button>
              <button onClick={() => sendCommand('STOP_OPERATION')} disabled={loading} className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-semibold rounded-lg transition-colors">
                {loading ? 'Enviando...' : '⏹️ STOP OPERATION'}
              </button>
              <button onClick={() => sendCommand('TRIGGER_EFFECT')} disabled={loading} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors">
                {loading ? 'Enviando...' : '✨ TRIGGER EFFECT'}
              </button>
              <button onClick={() => sendCommand('LOCK_SYSTEM')} disabled={loading} className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition-colors">
                {loading ? 'Enviando...' : '🔒 LOCK SYSTEM'}
              </button>
              <button onClick={() => sendCommand('EMERGENCY_STOP')} disabled={loading} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors">
                {loading ? 'Enviando...' : '🚨 EMERGENCY STOP'}
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <OperationalConsole />
        </div>
      </div>
    </div>
  )
}
