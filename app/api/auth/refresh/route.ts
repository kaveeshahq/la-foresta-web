import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
  refreshSession,
  setAuthCookies,
} from "@/lib/server/auth-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken =
    cookieStore.get(
      REFRESH_TOKEN_COOKIE
    )?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No active session." },
      { status: 401 }
    );
  }

  try {
    const tokens =
      await refreshSession(
        refreshToken
      );

    if (!tokens) {
      const response =
        NextResponse.json(
          {
            message:
              "Your session has expired.",
          },
          { status: 401 }
        );

      clearAuthCookies(response);
      return response;
    }

    const response =
      NextResponse.json({
        authenticated: true,
      });

    setAuthCookies(response, tokens);
    return response;
  } catch {
    return NextResponse.json(
      {
        message:
          "The account service is temporarily unavailable.",
      },
      { status: 503 }
    );
  }
}
