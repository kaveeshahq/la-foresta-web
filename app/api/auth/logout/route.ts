import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
  requestBackend,
} from "@/lib/server/auth-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken =
    cookieStore.get(
      REFRESH_TOKEN_COOKIE
    )?.value;

  if (refreshToken) {
    try {
      await requestBackend(
        "/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            refreshToken,
          }),
        }
      );
    } catch {
      // Clear the browser session even if Spring is unavailable.
    }
  }

  const response =
    new NextResponse(null, {
      status: 204,
    });

  clearAuthCookies(response);
  return response;
}
