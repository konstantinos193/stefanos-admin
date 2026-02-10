'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogIn, Lock, User } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-md">
        <div className="card shadow-2xl" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="relative h-20 w-20">
                <Image
                  src="/logoetc.png"
                  alt="SMH holdings logo"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-100">SMH Holdings</h1>
            <p className="text-lg text-slate-400 mt-2">Πίνακας Διαχείρισης</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/15 border-2 border-red-500/30 text-red-400 px-5 py-4 rounded-xl text-base font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-base font-semibold text-slate-300 mb-2">
                Όνομα Χρήστη
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-12 text-lg"
                  placeholder="Εισάγετε το όνομα χρήστη"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold text-slate-300 mb-2">
                Κωδικός Πρόσβασης
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 text-lg"
                  placeholder="Εισάγετε τον κωδικό σας"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center gap-3 h-14 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Σύνδεση...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  <span>Σύνδεση</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Ασφαλής πρόσβαση διαχείρισης SMH Holdings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

