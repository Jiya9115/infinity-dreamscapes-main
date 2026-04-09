import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import base64 encoder to convert the image buffer to a data URL
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Extract data from the frontend request
    const { prompt, style, aspect_ratio } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Append the requested style to the prompt for better results
    const finalPrompt = style ? `${prompt}, highly detailed, ${style} style` : prompt;

    // Get Hugging Face API key from Supabase secrets
    const HF_API_KEY = Deno.env.get("HF_API_KEY");

    if (!HF_API_KEY) {
      throw new Error("HF_API_KEY is not configured");
    }

    // 3. Call Hugging Face Stable Diffusion
   // 3. Call Hugging Face Stable Diffusion
const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: finalPrompt,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${errorText}`);
    }

    // 4. Convert response to a Base64 image URL
    const imageBuffer = await response.arrayBuffer();
    const base64 = encode(new Uint8Array(imageBuffer));
    const imageUrl = `data:image/png;base64,${base64}`;

    // 5. Return the JSON format the frontend expects!
    return new Response(
      JSON.stringify({ image_url: imageUrl }), 
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

  } catch (error) {
    console.error("generate-image error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});