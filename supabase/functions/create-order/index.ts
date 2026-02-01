import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LineItem {
  name: string;
  quantity: number;
  price: number;
  productId: string;
}

interface ConfigItem {
  productId: string;
  type: string;
  blockVariant?: string;
  widths?: number[];
  heights?: number[];
  depth?: number;
  totalWidth?: number;
  quantity: number;
  unitPrice: number;
}

interface ShippingAddress {
  line1: string;
  line2?: string | null;
  postalCode: string;
  city: string;
}

interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod: string;
  pickupLocation?: string | null;
  shippingAddress?: ShippingAddress | null;
  lineItems: LineItem[];
  configSnapshot: {
    version: number;
    items: ConfigItem[];
    promoCode: string | null;
    promoDiscount: number;
  };
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const orderData: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail || !orderData.deliveryMethod) {
      throw new Error("Missing required fields: customerName, customerEmail, or deliveryMethod");
    }

    if (!orderData.lineItems || orderData.lineItems.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    // Insert order into database
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone || null,
        delivery_method: orderData.deliveryMethod,
        pickup_location: orderData.pickupLocation || null,
        shipping_address: orderData.shippingAddress || null,
        line_items: orderData.lineItems,
        config_snapshot: orderData.configSnapshot,
        subtotal_amount: orderData.subtotalAmount,
        shipping_amount: orderData.shippingAmount,
        total_amount: orderData.totalAmount,
        status: "new",
        stripe_checkout_session_id: `free_order_${Date.now()}`,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Order created successfully:", data.id);

    return new Response(
      JSON.stringify({ success: true, orderId: data.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in create-order function:", error);
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
