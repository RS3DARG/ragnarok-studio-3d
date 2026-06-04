import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const supabase = await createClient();
  const term = `%${q}%`;
  const { data } = await supabase
    .from("figures")
    .select("id, name, saga, cover_url, slug")
    .or(`name.ilike.${term},saga.ilike.${term}`)
    .limit(6);

  return NextResponse.json({ results: data || [] });
}