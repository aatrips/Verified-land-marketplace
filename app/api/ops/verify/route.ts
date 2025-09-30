import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { id, verification } = await req.json();
    if (!id || !verification) {
      return NextResponse.json({ ok: false, error: "Missing id or verification" }, { status: 400 });
    }
    const { error } = await supabase
      .from("properties")
      .update({ verification })
      .eq("id", id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Unknown error" }, { status: 500 });
  }
}
