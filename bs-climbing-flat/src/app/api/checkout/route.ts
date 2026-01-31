import { NextResponse } from 'next/server'
import type { StepperConfig, Pricing } from '@/types'

interface CheckoutRequest {
  config: StepperConfig
  pricing: Pricing
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json()
    const { config, pricing } = body

    // Validate the request
    if (!config || !pricing) {
      return NextResponse.json(
        { error: 'Missing configuration or pricing data' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return a mock success for demo/development
      console.log('Stripe not configured, using demo mode')
      console.log('Order data:', JSON.stringify({ config, pricing }, null, 2))
      
      // Redirect to success page with demo flag
      const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?demo=true`
      return NextResponse.json({ url: successUrl })
    }

    // Dynamic import Stripe only when needed
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    // Build line items for Stripe
    const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Stepper STL-fil',
            description: `Custom crimp block med ${config.grips.length} grep`,
            metadata: {
              grips: JSON.stringify(config.grips),
            },
          },
          unit_amount: pricing.basePrice * 100, // Stripe uses cents
        },
        quantity: 1,
      },
    ]

    // Add custom imprint if enabled
    if (config.customImprint.enabled && pricing.imprintPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Custom imprint',
            description: `Tekst: "${config.customImprint.text}"`,
          },
          unit_amount: pricing.imprintPrice * 100,
        },
        quantity: 1,
      })
    }

    // Add shipping if applicable
    if (config.delivery.type === 'shipping' && pricing.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Frakt',
            description: 'Levering til din adresse',
          },
          unit_amount: pricing.shippingPrice * 100,
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: undefined, // Let Stripe collect email
      metadata: {
        config: JSON.stringify(config),
        pricing: JSON.stringify(pricing),
      },
      // Collect customer email for order confirmation
      billing_address_collection: config.delivery.type === 'shipping' ? 'required' : 'auto',
      shipping_address_collection: config.delivery.type === 'shipping' ? {
        allowed_countries: ['NO'],
      } : undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
