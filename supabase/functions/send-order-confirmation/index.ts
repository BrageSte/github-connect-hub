import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })
  : null;

async function resolveProductionNumber(order: OrderConfirmationRequest): Promise<OrderConfirmationRequest> {
  if (order.productionNumber !== undefined && order.productionNumber !== null) return order;
  if (!supabaseAdmin) return order;

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('production_number')
    .eq('id', order.orderId)
    .single();

  if (!error && data?.production_number) {
    return { ...order, productionNumber: data.production_number };
  }

  return order;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
}

interface OrderConfirmationRequest {
  orderId: string;
  productionNumber?: number;
  customerEmail: string;
  customerName: string;
  siteUrl?: string;
  items: OrderItem[];
  deliveryMethod: string;
  pickupLocation?: string;
  shippingAddress?: ShippingAddress;
  subtotal: number;
  shipping: number;
  promoDiscount?: number;
  total: number;
}

function formatPrice(amount: number): string {
  return `${amount.toLocaleString("nb-NO")},-`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatProductionNumber(value?: number | null, width = 4): string {
  if (value === null || value === undefined) return "";
  return value.toString().padStart(width, "0");
}


function generateEmailHtml(order: OrderConfirmationRequest): string {
  const productionNumber = formatProductionNumber(order.productionNumber);
  const baseUrl = (order.siteUrl || Deno.env.get("PUBLIC_SITE_URL") || "").replace(/\\/$/, "");
  const statusUrl = baseUrl
    ? `${baseUrl}/order-status?orderId=${encodeURIComponent(order.orderId)}`
    : "";
  const safeStatusUrl = statusUrl ? escapeHtml(statusUrl) : "";

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #333;">${escapeHtml(item.name)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  let deliveryHtml = "";
  if (order.deliveryMethod === "shipping" && order.shippingAddress) {
    deliveryHtml = `
      <p style="margin: 0 0 8px 0;"><strong>Leveringsmetode:</strong> Hjemlevering</p>
      <p style="margin: 0 0 4px 0;">${escapeHtml(order.shippingAddress.line1)}</p>
      ${
        order.shippingAddress.line2
          ? `<p style="margin: 0 0 4px 0;">${escapeHtml(order.shippingAddress.line2)}</p>`
          : ""
      }
      <p style="margin: 0;">${escapeHtml(order.shippingAddress.postalCode)} ${escapeHtml(order.shippingAddress.city)}</p>
    `;
  } else if (order.pickupLocation) {
    deliveryHtml = `
      <p style="margin: 0 0 8px 0;"><strong>Leveringsmetode:</strong> Henting</p>
      <p style="margin: 0;">${escapeHtml(order.pickupLocation)}</p>
    `;
  } else {
    deliveryHtml = `<p style="margin: 0;"><strong>Leveringsmetode:</strong> Digital levering</p>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ordrebekreftelse - BS Climbing</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f0f0f; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">BS Climbing</h1>
      <p style="margin: 8px 0 0 0; color: #888888; font-size: 14px;">Skreddersydde klatregrep</p>
    </div>

    <!-- Main content -->
    <div style="background-color: #1a1a1a; border-radius: 16px; padding: 32px; border: 1px solid #333;">
      <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #ffffff;">Takk for bestillingen!</h2>
      <p style="margin: 0 0 24px 0; color: #888888;">
        Hei ${escapeHtml(order.customerName)}, vi har mottatt din bestilling og setter i gang med produksjonen snart.
      </p>

      <!-- Order ID -->
      <div style="background-color: #262626; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #888888;">Ordrenummer</p>
        <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #ff6b35; font-family: monospace;">${escapeHtml(order.orderId)}</p>
        ${productionNumber ? `
        <p style="margin: 12px 0 0 0; font-size: 14px; color: #888888;">Produksjonsnummer</p>
        <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #ff6b35; font-family: monospace;">${escapeHtml(productionNumber)}</p>
        ` : ''}
      </div>
      ${safeStatusUrl ? `
      <div style="margin-bottom: 24px;">
        <a href="${safeStatusUrl}" style="display: inline-block; padding: 12px 18px; background-color: #ff6b35; color: #0f0f0f; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Sjekk ordrestatus
        </a>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #888888;">
          Følg produksjon og printkø direkte via lenken.
        </p>
      </div>
      ` : ''}

      <!-- Items table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #333; color: #888888; font-weight: 500; font-size: 14px;">Produkt</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #333; color: #888888; font-weight: 500; font-size: 14px;">Antall</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #333; color: #888888; font-weight: 500; font-size: 14px;">Pris</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="border-top: 1px solid #333; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #888888;">Delsum</span>
          <span style="color: #ffffff;">${formatPrice(order.subtotal)}</span>
        </div>
        ${order.shipping > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #888888;">Frakt</span>
          <span style="color: #ffffff;">${formatPrice(order.shipping)}</span>
        </div>
        ` : ""}
        ${order.promoDiscount && order.promoDiscount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #22c55e;">Rabatt</span>
          <span style="color: #22c55e;">-${formatPrice(order.promoDiscount)}</span>
        </div>
        ` : ""}
        <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #333;">
          <span style="font-weight: 600; font-size: 18px; color: #ffffff;">Totalt</span>
          <span style="font-weight: 600; font-size: 18px; color: #ff6b35;">${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>

    <!-- Delivery info -->
    <div style="background-color: #1a1a1a; border-radius: 16px; padding: 24px; margin-top: 24px; border: 1px solid #333;">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #ffffff;">Leveringsinformasjon</h3>
      <div style="color: #cccccc; font-size: 14px;">
        ${deliveryHtml}
      </div>
    </div>

    <!-- What's next -->
    <div style="background-color: #1a1a1a; border-radius: 16px; padding: 24px; margin-top: 24px; border: 1px solid #333;">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #ffffff;">Hva skjer nå?</h3>
      <ol style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
        <li>Vi gjennomgår bestillingen din</li>
        <li>Grepet produseres spesialtilpasset dine mål</li>
        <li>Du mottar en e-post når ordren sendes/er klar til henting</li>
      </ol>
    </div>

    <!-- Returns -->
    <div style="background-color: #1a1a1a; border-radius: 16px; padding: 24px; margin-top: 24px; border: 1px solid #333;">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #ffffff;">Angrerett og retur</h3>
      <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.8;">
        <li>Stepper (ferdig printet) produseres på bestilling og omfattes ikke av angrerett.</li>
        <li>Digitale filer leveres umiddelbart. Når du samtykker til umiddelbar levering bortfaller angreretten.</li>
        <li>Ved feil eller mangel ordner vi opp – send oss ordrenummer og bilder.</li>
      </ul>
      <p style="margin: 12px 0 0 0; color: #cccccc; font-size: 14px;">
        Returadresse: Åstadlia 18, 1396 Billingstad, Norway. Retur avtales alltid på forhånd.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; color: #666666; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">Har du spørsmål? Kontakt oss på post@bsclimbing.no</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} BS Climbing. Alle rettigheter reservert.</p>
    </div>
  </div>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(RESEND_API_KEY);
    let orderData: OrderConfirmationRequest = await req.json();

    // Validate required fields
    if (!orderData.orderId || !orderData.customerEmail || !orderData.customerName) {
      throw new Error("Missing required fields: orderId, customerEmail, or customerName");
    }

    orderData = await resolveProductionNumber(orderData);

    const emailHtml = generateEmailHtml(orderData);

    // Note: The sender domain must be verified in Resend.
    const emailResponse = await resend.emails.send({
      from: "BS Climbing <post@bsclimbing.no>",
      to: [orderData.customerEmail],
      reply_to: "post@bsclimbing.no",
      subject: `Ordrebekreftelse #${orderData.orderId.slice(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending order confirmation email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
