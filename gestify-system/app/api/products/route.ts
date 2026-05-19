import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { ApiError } from "@/lib/server/errors";
import { handleRouteError } from "@/lib/server/route-utils";

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  status: z.enum(["ativo", "inativo", "esgotado"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    return NextResponse.json(await db.listProducts(search));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = productSchema.parse(await req.json());
    const status =
      body.stock === 0 ? "esgotado" : (body.status ?? "ativo");
    const product = await db.createProduct({ ...body, status });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
