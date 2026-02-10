import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, error: "Payment not completed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Extract metadata
    const meta = session.metadata || {};
    const items = meta.items_json ? JSON.parse(meta.items_json) : [];
    const shippingAddress = meta.shipping_address
      ? JSON.parse(meta.shipping_address)
      : null;

    const result = {
      success: true,
      sessionId: session.id,
      customerEmail: session.customer_email || session.customer_details?.email,
      customerName: meta.customer_name,
      customerPhone: meta.customer_phone || null,
      deliveryMethod: meta.delivery_method,
      shippingAddress,
      promoCode: meta.promo_code || null,
      promoDiscount: Number(meta.promo_discount_nok || 0),
      shippingAmount: Number(meta.shipping_amount_nok || 0),
      totalAmount: (session.amount_total || 0) / 100, // øre to NOK
      items,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
    };

    console.log("[VERIFY-SESSION] Verified:", session.id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[VERIFY-SESSION] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
