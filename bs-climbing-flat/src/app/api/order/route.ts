import { NextResponse } from 'next/server'
import type { StepperConfig, Pricing, CADGenerationResponse } from '@/types'

/**
 * Order API Route
 * 
 * This endpoint receives the Stepper configuration after successful payment
 * and coordinates with the external CAD engine to generate the STL file.
 * 
 * INTEGRATION POINT FOR CAD ENGINE:
 * ---------------------------------
 * The CAD engine is a separate service that generates STL files based on
 * the grip configurations. To integrate:
 * 
 * 1. Set the CAD_API_ENDPOINT environment variable to your CAD service URL
 * 2. Set the CAD_API_KEY if authentication is required
 * 3. The CAD service should accept a POST request with the config data
 * 4. The CAD service should return a URL to the generated STL file
 * 
 * Expected CAD API request format:
 * {
 *   grips: [{ id: 1, height: 15, width: 50 }, ...],
 *   customImprint: { enabled: boolean, text: string }
 * }
 * 
 * Expected CAD API response format:
 * {
 *   success: boolean,
 *   stlUrl: string,
 *   previewUrl?: string,
 *   error?: string
 * }
 */

interface OrderRequest {
  sessionId: string
  config: StepperConfig
  pricing: Pricing
  customerEmail: string
}

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json()
    const { sessionId, config, pricing, customerEmail } = body

    // Validate required fields
    if (!sessionId || !config || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // =========================================
    // CAD ENGINE INTEGRATION (MOCK)
    // =========================================
    // 
    // Replace this section with actual CAD API call:
    //
    // const cadResponse = await fetch(process.env.CAD_API_ENDPOINT!, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.CAD_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     grips: config.grips,
    //     customImprint: config.customImprint,
    //   }),
    // })
    //
    // const cadData: CADGenerationResponse = await cadResponse.json()
    //
    // if (!cadData.success) {
    //   throw new Error(cadData.error || 'CAD generation failed')
    // }
    //

    // MOCK RESPONSE - Remove when integrating real CAD engine
    const cadData: CADGenerationResponse = {
      success: true,
      stlUrl: `https://files.bsclimbing.no/orders/${sessionId}/stepper.stl`,
      previewUrl: `https://files.bsclimbing.no/orders/${sessionId}/preview.png`,
    }

    // =========================================
    // END CAD ENGINE INTEGRATION
    // =========================================

    // Store order in database (implement as needed)
    const order = {
      id: sessionId,
      config,
      pricing,
      customerEmail,
      stlUrl: cadData.stlUrl,
      createdAt: new Date().toISOString(),
      status: 'completed',
    }

    console.log('Order created:', order)

    // =========================================
    // EMAIL NOTIFICATION (PLACEHOLDER)
    // =========================================
    //
    // Send confirmation email to customer:
    //
    // await sendEmail({
    //   to: customerEmail,
    //   subject: 'Din Stepper er klar! 🧗',
    //   template: 'order-confirmation',
    //   data: {
    //     orderId: sessionId,
    //     stlUrl: cadData.stlUrl,
    //     config,
    //     pricing,
    //     pickupLocation: config.delivery.type === 'pickup' 
    //       ? PICKUP_LOCATIONS[config.delivery.location]
    //       : null,
    //   },
    // })
    //

    return NextResponse.json({
      success: true,
      orderId: sessionId,
      stlUrl: cadData.stlUrl,
      message: 'Order processed successfully',
    })
  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}

/**
 * GET handler to retrieve order status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID required' },
      { status: 400 }
    )
  }

  // TODO: Implement order lookup from database
  // For now, return mock data
  return NextResponse.json({
    orderId,
    status: 'completed',
    stlUrl: `https://files.bsclimbing.no/orders/${orderId}/stepper.stl`,
  })
}
