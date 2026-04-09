import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret!);

    // Check if the payment was successful
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // We need the Service Role key to securely update the database
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // This is the user ID you MUST pass from your frontend when creating the checkout session
      const userId = session.client_reference_id; 
      const amountPaid = session.amount_total; // in cents (e.g., 1900 = $19.00)
      
      // Give credits based on how much they paid
// Give credits based on the exact plans from the Pricing page
      let creditsToAdd = 0;
      let planName = "Custom";
      
      if (amountPaid === 1000) {
        creditsToAdd = 100;
        planName = "Basic";
      } else if (amountPaid === 5000) {
        creditsToAdd = 500;
        planName = "Advanced";
      } else if (amountPaid === 25000) {
        creditsToAdd = 5000;
        planName = "Business";
      }

      if (userId && creditsToAdd > 0) {
        // 1. Get current credits
        const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single();
        
        // 2. Add the new credits
        await supabase.from("profiles").update({ 
          credits: (profile?.credits || 0) + creditsToAdd 
        }).eq("id", userId);

        // 3. Log it for your Admin Panel (MATCHING YOUR EXACT DATABASE COLUMNS)
        await supabase.from("payments").insert({
          id: session.id,          // Your ID column is text, perfect for Stripe's session ID
          user_id: userId,
          amount: amountPaid,      // Your column is 'amount'
          plan: planName,          // Your column is 'plan'
          status: "completed"      // Your column is 'status'
        });
      }
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});