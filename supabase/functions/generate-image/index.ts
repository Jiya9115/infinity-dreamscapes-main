import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const finalPrompt = style ? `${prompt}, ${style} style, 8k resolution, highly detailed` : prompt;
    const HF_API_KEY = Deno.env.get("HF_API_KEY");

    if (!HF_API_KEY) {
      throw new Error("HF_API_KEY is not set in Supabase Secrets");
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true", 
        },
        body: JSON.stringify({ inputs: finalPrompt }),
      }
    );

    // FIX 1: Better Error Handling
    // If the response is not OK, Hugging Face sends JSON errors. 
    // If it IS ok, it sends an IMAGE (binary).
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HF Error: ${response.statusText}`);
    }

    // FIX 2: Correctly processing binary data
    const imageBuffer = await response.arrayBuffer();
    
    // Check if we actually got data back
    if (imageBuffer.byteLength === 0) {
      throw new Error("Received empty image data from Hugging Face");
    }

    const base64 = encode(new Uint8Array(imageBuffer));
    
    return new Response(
      JSON.stringify({ image_url: `data:image/png;base64,${base64}` }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});