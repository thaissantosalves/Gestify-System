import { NextResponse } from "next/server";
import { db } from "@/lib/server/database";
import { handleRouteError } from "@/lib/server/route-utils";

export async function GET() {
  try {
    const data = await db.getAll();
    const unreadCount = data.notifications.filter((n) => !n.read).length;
    return NextResponse.json({
      products: data.products,
      orders: data.orders,
      teamMembers: data.teamMembers,
      stockMovements: data.stockMovements,
      notifications: data.notifications,
      unreadCount,
      settings: data.settings,
      categories: data.categories,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
