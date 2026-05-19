import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/server/supabase";
import { handleRouteError } from "@/lib/server/route-utils";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, hint: error.hint },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      source: "supabase",
      productsCount: count ?? 0,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
