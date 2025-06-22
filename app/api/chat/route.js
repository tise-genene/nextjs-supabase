import { NextResponse } from 'next/server'

export async function POST(req) {
  const { message } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 })
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
      max_tokens: 256,
    }),
  })

  const data = await response.json()
  console.log('OpenAI API response:', data)

  if (data.error) {
    return NextResponse.json({ response: `Error: ${data.error.message}` }, { status: 500 })
  }

  const aiMessage = data.choices?.[0]?.message?.content || 'No response.'

  return NextResponse.json({ response: aiMessage })
} 