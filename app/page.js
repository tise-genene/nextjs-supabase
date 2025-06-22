// This is now a Server Component by default (no 'use client')
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CountriesList from './countries-list' // Import the new client component

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // 1. Fetch data on the server
  const { data: countries } = await supabase.from('countries').select('*')

  // 2. Render the client component, passing the data as a prop
  return <CountriesList initialCountries={countries || []} />
}
