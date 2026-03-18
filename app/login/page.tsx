'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/dashboard';
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#2D2926] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#FFC600]">CIMED PLAY</h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ backgroundColor: 'white', color: '#2D2926', padding: '10px', width: '100%' }}
            className="rounded p-2 w-full"
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: 'white', color: '#2D2926', padding: '10px', width: '100%' }}
            className="rounded p-2 w-full"
          />
          
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ backgroundColor: '#FFC600', color: '#2D2926', fontWeight: 'bold', padding: '10px', width: '100%' }}
            className="rounded font-bold"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
