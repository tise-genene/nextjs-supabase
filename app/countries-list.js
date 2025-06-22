'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Accept initialCountries as a prop
export default function CountriesList({ initialCountries }) {
  // Initialize state with the server-fetched data
  const [countries, setCountries] = useState(initialCountries)
  const [newCountryName, setNewCountryName] = useState('')
  const router = useRouter()
  // Create a Supabase client for client-side interactions
  const supabase = createClientComponentClient()

  useEffect(() => {
    // The real-time subscription logic remains the same.
    // We no longer need to fetch initial data here since the server provides it.
    const channel = supabase
      .channel('countries-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'countries' },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT') {
            setCountries((currentCountries) => [...currentCountries, payload.new])
          }
          if (payload.eventType === 'UPDATE') {
            setCountries((currentCountries) =>
              currentCountries.map((country) =>
                country.id === payload.new.id ? payload.new : country
              )
            )
          }
          if (payload.eventType === 'DELETE') {
            setCountries((currentCountries) =>
              currentCountries.filter((country) => country.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // The dependency array is now empty

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newCountryName === '') return

    const { error } = await supabase
      .from('countries')
      .insert({ name: newCountryName })

    if (error) {
      console.error('Error inserting data:', error)
    } else {
      setNewCountryName('')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Countries</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCountryName}
          onChange={(e) => setNewCountryName(e.target.value)}
          placeholder="New country name"
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ marginTop: '20px' }}>
        {countries.map((country) => (
          <li key={country.id}>{country.name}</li>
        ))}
      </ul>
    </div>
  )
} 