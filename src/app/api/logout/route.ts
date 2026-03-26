import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Clear the payload-token cookie
  cookieStore.delete("payload-token");

  // Also try setting it to expired
  cookieStore.set("payload-token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return NextResponse.json({ success: true });
}
