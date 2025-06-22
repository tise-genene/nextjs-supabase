import Stripe from 'stripe'

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  // For demo: a single test product, $10 USD
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 1000, // $10.00 in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000?success=true',
    cancel_url: 'http://localhost:3000?canceled=true',
  })

  return Response.json({ url: session.url })
} 