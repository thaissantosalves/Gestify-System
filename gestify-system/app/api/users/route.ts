import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["Administrador", "Gerente", "Vendedor", "Estoquista"]),
  status: z.enum(["ativo", "inativo"]),
});

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    return NextResponse.json(await db.listUsers(search));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = userSchema.parse(await req.json());
    const user = await db.createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
