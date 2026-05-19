import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

export async function PATCH() {
  try {
    const notifications = await db.markAllNotificationsRead();
    return NextResponse.json({ notifications, unreadCount: 0 });
  } catch (err) {
    return handleRouteError(err);
  }
}
