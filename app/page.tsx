'use client';

import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import Alert components (Make sure you have these in components/ui/alert)
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  
  // State for inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleLogin = () => {
    // 1. CLEAR PREVIOUS ERRORS
    setError('');

    // 2. CHECK CREDENTIALS (Hardcoded for now)
    // You can change these values to whatever you want
    if (username === 'admin' && password === '1234') {
      router.push('/dashboard');
    } else {
      // 3. SHOW ERROR IF WRONG
      setError('Invalid username or password');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'url(/logo.png)', 
          backgroundSize: '120px', 
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500 mt-2 text-sm">Welcome back!</p>
        </div>

        {/* ERROR POPUP (Only shows if error exists) */}
        {error && (
          <div className="mb-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-purple-600 text-gray-900" 
            />
            <User className="absolute right-0 top-2 text-gray-400 w-5 h-5" />
          </div>
          <div className="relative group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-purple-600 text-gray-900" 
            />
            <Lock className="absolute right-0 top-2 text-gray-400 w-5 h-5" />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-full hover:bg-purple-700 shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}