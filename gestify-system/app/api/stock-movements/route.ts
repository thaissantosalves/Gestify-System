import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { ApiError } from "@/lib/server/errors";
import { handleRouteError } from "@/lib/server/route-utils";

const movementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["entrada", "saída", "ajuste"]),
  quantity: z
    .number()
    .int()
    .refine((n) => n !== 0, "Quantidade não pode ser zero"),
  user: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    return NextResponse.json(await db.listStockMovements(search));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = movementSchema.parse(await req.json());
    const result = await db.createStockMovement(body);
    if (!result) throw new ApiError("Produto não encontrado", 404);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
