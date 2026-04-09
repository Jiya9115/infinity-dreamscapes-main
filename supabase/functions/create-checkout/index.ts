import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from "npm:stripe@^14.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // 1. Verify the user
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    // 2. Read which button they clicked on the frontend
    const { tier } = await req.json();

    // 3. Match the button to your Stripe Price IDs 
    // 👇 Puta your actual Stripe API IDs here! 👇
    const priceIds: Record<string, string> = {
      basic: "price_1TFp2bJR46lA748mw5BHPcwg",       // $10
      advanced: "price_1TFp3LJR46lA748mAzNugeHQ", // $50
      business: "price_1TFp3kJR46lA748mo3CbCwJP", // $250
    };

    const priceId = priceIds[tier];
    if (!priceId) throw new Error("Invalid plan selected");

    // 4. Initialize Stripe
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe secret key missing");
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // 5. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: user.id, // Tells us WHO paid
      metadata: {
        tier: tier, // Tells us WHAT they bought so we can add the right credits!
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: 'http://localhost:8080/generate?success=true',
      cancel_url: 'http://localhost:8080/pricing?canceled=true',
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});