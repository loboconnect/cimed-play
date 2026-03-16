'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) } else { setTimeout(() => { window.location.href = '/dashboard' }, 500) }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <div className='bg-gray-900 p-8 rounded-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-white mb-6 text-center'>Synapse Login</h1>
        {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
        <form onSubmit={handleLogin} className='space-y-4'>
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white' />
          <input type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white' />
          <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white py-2 px-4 rounded'>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
