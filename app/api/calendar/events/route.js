import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET() {
  // Get the user's session (includes access token)
  const session = await getServerSession(authOptions)
  const accessToken = session?.token?.accessToken || session?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Call Google Calendar API
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await res.json()

  return NextResponse.json({ events: data.items || [] })
} 