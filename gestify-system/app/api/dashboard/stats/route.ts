import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

export async function GET() {
  try {
    return NextResponse.json(await db.getDashboardStats());
  } catch (err) {
    return handleRouteError(err);
  }
}
