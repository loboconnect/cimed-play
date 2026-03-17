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
    <div className='min-h-screen flex items-center justify-center bg-[#FFC600]'>
      <div className='bg-[#2D2926] p-8 rounded-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-[#FFC600] mb-6 text-center'>CIMED PLAY</h1>
        {error && <div className='text-red-400 text-sm mb-4'>{error}</div>}
        <form onSubmit={handleLogin} className='space-y-4'>
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-3 py-2 bg-black border border-gray-700 rounded text-white' />
          <input type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-3 py-2 bg-black border border-gray-700 rounded text-white' />
          <button type='submit' disabled={loading} className='w-full bg-[#FFC600] text-[#2D2926] font-bold py-2 px-4 rounded hover:opacity-90'>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
