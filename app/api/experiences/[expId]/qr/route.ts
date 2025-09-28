import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { generateQrCode } from "@/lib/qrService"; 

// Use a fallback domain if environment variable is not set
const PUBLIC_EXPERIENCE_DOMAIN = process.env.PUBLIC_EXPERIENCE_DOMAIN || "https://cxperiahq.com";

// --- GET /api/experience/[expId]/qr (Fetch existing QR code) ---
// Mapped from: static async fetchQrCode(req, res)
export async function GET(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = createClient();
  const experienceId = params.expId;

  if (!experienceId) {
    return NextResponse.json({ error: "Missing experienceId parameter" }, { status: 400 });
  }

  try {
    // Fetch only the existing QR code URL
    const { data: exp, error } = await supabase
      .from('experiences')
      .select('qr_code_url, experience_url')
      .eq('id', experienceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Experience not found" }, { status: 404 });
      }
      throw error;
    }

    if (exp?.qr_code_url) {
      return NextResponse.json({ qr: exp.qr_code_url, url: exp.experience_url });
    }
    
    // If experience found but QR code is not generated yet, prompt client to POST/generate
    return NextResponse.json({ error: "QR code not yet generated for this experience" }, { status: 404 });
  } catch (err: any) {
    console.error("Error fetching QR code:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// --- POST /api/experience/[expId]/qr (Generate and store QR code) ---
// Mapped from: static async getQrCode(req, res) - handles generation and upsert/publish
export async function POST(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = createClient();
  const experienceId = params.expId;
  
  if (!experienceId) {
    return NextResponse.json({ error: "Missing experienceId parameter" }, { status: 400 });
  }

  // Check for raw text, defaulting to URL construction if expId is present
  let urlToEncode: string | null = null;
  let rawText: string | undefined = undefined;
  
  try {
    const body = await req.json();
    rawText = body.text || req.nextUrl.searchParams.get('text') || undefined;
  } catch (e) {
    rawText = req.nextUrl.searchParams.get('text') || undefined;
  }

  let productName = null;

  try {
    // 1. Fetch experience and product info
    const { data: expResult, error: selectError } = await supabase
      .from('experiences')
      .select(`
        public_slug, 
        qr_code_url, 
        experience_url,
        product:product_id (name)
      `)
      .eq('id', experienceId)
      .single();

    if (selectError) {
      if (selectError.code === 'PGRST116') {
        return NextResponse.json({ error: "Experience not found" }, { status: 404 });
      }
      throw selectError;
    }

    const { public_slug, qr_code_url: existingQr, experience_url: existingUrl } = expResult;
    productName = expResult.product?.name || null;

    // A. Check for existing QR code (Short-circuit return)
    if (existingQr && existingUrl) {
      console.log("Existing QR found, returning cached version.");
      return NextResponse.json({ qr: existingQr, url: existingUrl, productName });
    }
    
    // B. Determine URL to encode
    if (rawText) {
      // If raw text is provided, use it (overrides public_slug logic)
      urlToEncode = rawText;
    } else if (public_slug) {
      // Construct the public URL from the slug
      urlToEncode = `${PUBLIC_EXPERIENCE_DOMAIN}/experience/${public_slug}`;
    } else {
       return NextResponse.json({ error: "Experience found but missing public_slug. Cannot generate URL." }, { status: 400 });
    }

    // 2. Generate QR code
    const qrDataUrl = await generateQrCode(urlToEncode);
    console.log("Generated new QR code for URL:", urlToEncode);

    // 3. Update experience record with new QR and set published status
    const { error: updateError } = await supabase
      .from('experiences')
      .update({ 
        qr_code_url: qrDataUrl, 
        experience_url: urlToEncode, 
        is_published: true 
      })
      .eq('id', experienceId);
    
    if (updateError) {
      console.error("Failed to update qr_code_url:", updateError);
      // Still return the generated QR even if DB update failed
    }

    return NextResponse.json({ qr: qrDataUrl, url: urlToEncode, productName });

  } catch (err: any) {
    console.error("Error generating QR code:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
