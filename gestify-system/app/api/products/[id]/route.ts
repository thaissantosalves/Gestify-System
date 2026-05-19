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

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await db.getProduct(id);
    if (!product) throw new ApiError("Produto não encontrado", 404);
    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = productSchema.partial().parse(await req.json());
    const product = await db.updateProduct(id, body);
    if (!product) throw new ApiError("Produto não encontrado", 404);
    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const ok = await db.deleteProduct(id);
    if (!ok) throw new ApiError("Produto não encontrado", 404);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
