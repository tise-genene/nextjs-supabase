'use client';

import { useEffect, useState } from 'react';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/calendar/events');
        const data = await res.json();
        if (res.ok) {
          setEvents(data.events);
        } else {
          setError(data.error || 'Failed to fetch events');
        }
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Google Calendar Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            background: '#fafafa',
          }}>
            <div style={{ fontWeight: 600 }}>{event.summary || 'No Title'}</div>
            <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start?.date || 'No start time'}
              {event.end?.dateTime ? ' - ' + new Date(event.end.dateTime).toLocaleString() : event.end?.date ? ' - ' + event.end.date : ''}
            </div>
            {event.location && <div style={{ color: '#2563eb', fontSize: '0.95rem' }}>{event.location}</div>}
            {event.description && <div style={{ marginTop: '0.5rem', color: '#374151' }}>{event.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
} 