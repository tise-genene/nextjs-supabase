'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Google Calendar Auth Demo</h2>
      {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()} style={{ padding: '10px 20px' }}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn('google')} style={{ padding: '10px 20px' }}>Sign in with Google</button>
      )}
    </div>
  )
} 