'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      // On successful sign-up, redirect to the home page.
      router.push('/')
      router.refresh() // Ensures the server component is re-rendered
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      // On successful sign-in, redirect to the home page.
      router.push('/')
      router.refresh() // Ensures the server component is re-rendered
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign In / Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '10px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSignIn} style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>Sign In</button>
          <button onClick={handleSignUp} style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </form>
    </div>
  )
} 