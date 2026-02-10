import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CartItem {
  name: string;
  price: number; // in NOK (kroner)
  quantity: number;
  isDigital?: boolean;
  config?: Record<string, unknown>;
}

interface CheckoutRequest {
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
  };
  promoCode?: string;
  promoDiscount: number; // in NOK
  shippingAmount: number; // in NOK
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const body: CheckoutRequest = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      shippingAddress,
      promoCode,
      promoDiscount,
      shippingAmount,
      successUrl,
      cancelUrl,
    } = body;

    if (!items?.length || !customerEmail || !customerName) {
      throw new Error("Missing required fields");
    }

    // Build line items with price_data (custom/configurable products)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: "nok",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert NOK to øre
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as a line item if applicable
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "nok",
          product_data: {
            name: "Frakt",
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    // Build discount coupon if promo code gives a discount
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (promoDiscount > 0) {
      // Create an inline coupon for the discount amount
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(promoDiscount * 100),
        currency: "nok",
        duration: "once",
        name: promoCode || "Rabatt",
      });
      discounts.push({ coupon: coupon.id });
    }

    // Store order metadata for webhook/success page retrieval
    const metadata: Record<string, string> = {
      customer_name: customerName,
      customer_phone: customerPhone || "",
      delivery_method: deliveryMethod,
      promo_code: promoCode || "",
      promo_discount_nok: String(promoDiscount),
      shipping_amount_nok: String(shippingAmount),
      items_json: JSON.stringify(
        items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          isDigital: i.isDigital,
          config: i.config,
        }))
      ),
    };

    if (shippingAddress) {
      metadata.shipping_address = JSON.stringify(shippingAddress);
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata,
      payment_method_types: ["card"],
      locale: "nb",
    };

    if (discounts.length > 0) {
      sessionParams.discounts = discounts;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("[CREATE-CHECKOUT] Session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CHECKOUT] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
