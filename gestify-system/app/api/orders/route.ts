import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

const orderSchema = z.object({
  customer: z.string().min(1),
  items: z.number().int().positive(),
  total: z.number().positive(),
  channel: z.enum(["Loja física", "E-commerce", "WhatsApp", "Marketplace"]),
  status: z.enum(["pendente", "pago", "enviado", "cancelado"]),
});

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    return NextResponse.json(await db.listOrders(search));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = orderSchema.parse(await req.json());
    const order = await db.createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
