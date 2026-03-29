import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const payload = await getPayload({ config });

    const result = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (!result.token) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set the cookie server-side so it's properly httpOnly
    const cookieStore = await cookies();
    cookieStore.set("payload-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      user: result.user,
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
}
