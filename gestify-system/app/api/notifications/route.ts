import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

const createSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["estoque", "venda", "usuario", "sistema", "integracao"]),
  href: z.string().optional(),
});

export async function GET() {
  try {
    const notifications = await db.listNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    const notification = await db.createNotification(body);
    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
