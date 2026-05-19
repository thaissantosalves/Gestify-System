import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

const settingsSchema = z.object({
  storeName: z.string().min(1).optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  operatingDays: z.string().optional(),
});

export async function GET() {
  try {
    return NextResponse.json(await db.getSettings());
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = settingsSchema.parse(await req.json());
    const settings = await db.updateSettings(body);
    return NextResponse.json(settings);
  } catch (err) {
    return handleRouteError(err);
  }
}
