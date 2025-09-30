// app/api/seller/route.ts
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

// Minimal zod-like validation (manual for now)
function requireString(v: any) {
  return typeof v === "string" && v.trim().length > 0
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, city, state, pincode, heroUrl } = body || {};

    if (!requireString(title) || !requireString(city) || !requireString(state)) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
    }

    // Insert into Supabase (public schema)
    const { data, error } = await supabase
  .from("properties")
  .insert([{
    title, city, state,
    pincode: pincode || null,
    verification: "IN_PROGRESS",
    hero_url: heroUrl || null,   // 👈 save the image url
  }])
  .select("id");
   // return new id

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.[0]?.id }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}
