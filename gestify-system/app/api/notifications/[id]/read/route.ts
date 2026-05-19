import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { ApiError } from "@/lib/server/errors";
import { handleRouteError } from "@/lib/server/route-utils";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const notification = await db.markNotificationRead(id);
    if (!notification) throw new ApiError("Notificação não encontrada", 404);
    const all = await db.listNotifications();
    const unreadCount = all.filter((n) => !n.read).length;
    return NextResponse.json({ notification, unreadCount });
  } catch (err) {
    return handleRouteError(err);
  }
}
