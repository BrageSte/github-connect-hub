import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
      auth: { persistSession: false },
    })
  : null;

const ERROR_CODES = {
  missingOrderId: "OS_MISSING_ORDER_ID",
  notFound: "OS_NOT_FOUND",
  dbError: "OS_DB_ERROR",
  configMissing: "OS_CONFIG_MISSING",
} as const;

interface OrderStatusRequest {
  orderId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuration missing",
          code: ERROR_CODES.configMissing,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const body: OrderStatusRequest = await req.json();
    const orderId = body.orderId?.trim();

    if (!orderId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "orderId is required",
          code: ERROR_CODES.missingOrderId,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 500;
      return new Response(
        JSON.stringify({
          success: false,
          error: status === 404 ? "Order not found" : "Database error",
          code: status === 404 ? ERROR_CODES.notFound : ERROR_CODES.dbError,
        }),
        {
          status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Order not found",
          code: ERROR_CODES.notFound,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    let queueInfo: {
      position?: number;
      ahead?: number;
      total?: number;
      basis?: "printing" | "ready_to_print" | "in_production";
    } | null = null;

    const queueStatuses = ["printing", "ready_to_print", "in_production"] as const;
    if (queueStatuses.includes(order.status) && order.production_number) {
      const { count: aheadCount } = await supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", order.status)
        .lt("production_number", order.production_number);

      const { count: totalCount } = await supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", order.status);

      const ahead = aheadCount ?? 0;
      queueInfo = {
        position: ahead + 1,
        ahead,
        total: totalCount ?? undefined,
        basis: order.status,
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          createdAt: order.created_at,
          status: order.status,
          productionNumber: order.production_number,
          deliveryMethod: order.delivery_method,
          pickupLocation: order.pickup_location,
          shippingAddress: order.shipping_address,
          lineItems: order.line_items,
          configSnapshot: order.config_snapshot,
          subtotalAmount: order.subtotal_amount,
          shippingAmount: order.shipping_amount,
          totalAmount: order.total_amount,
          customerName: order.customer_name,
        },
        queue: queueInfo,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
