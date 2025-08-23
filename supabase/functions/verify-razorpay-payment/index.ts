import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing required payment data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured")
    }

    // Compute HMAC in Base64 (to match Razorpay’s signature format)
    const message = `${razorpay_order_id}|${razorpay_payment_id}`
    const encoder = new TextEncoder()

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpayKeySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message))
    const calculatedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    )

    const isValid = calculatedSignature === razorpay_signature

    if (isValid) {
      return new Response(
        JSON.stringify({ success: true, verified: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, verified: false, error: "Signature mismatch" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error verifying payment:", error)
    return new Response(
      JSON.stringify({ success: false, verified: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
