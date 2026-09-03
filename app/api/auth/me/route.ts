import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  readBackendBody,
  REFRESH_TOKEN_COOKIE,
  refreshSession,
  requestBackend,
  setAuthCookies,
} from "@/lib/server/auth-session";

async function requestCurrentUser(
  accessToken: string
) {
  return requestBackend(
    "/api/users/me",
    {
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get(
      ACCESS_TOKEN_COOKIE
    )?.value;
  const refreshToken =
    cookieStore.get(
      REFRESH_TOKEN_COOKIE
    )?.value;

  try {
    if (accessToken) {
      const backendResponse =
        await requestCurrentUser(
          accessToken
        );

      if (backendResponse.ok) {
        return NextResponse.json(
          await readBackendBody(
            backendResponse
          )
        );
      }

      if (
        backendResponse.status !==
        401
      ) {
        return NextResponse.json(
          await readBackendBody(
            backendResponse
          ),
          {
            status:
              backendResponse.status,
          }
        );
      }
    }

    if (refreshToken) {
      const tokens =
        await refreshSession(
          refreshToken
        );

      if (tokens) {
        const backendResponse =
          await requestCurrentUser(
            tokens.accessToken
          );

        const response =
          NextResponse.json(
            await readBackendBody(
              backendResponse
            ),
            {
              status:
                backendResponse.status,
            }
          );

        setAuthCookies(
          response,
          tokens
        );

        return response;
      }
    }

    const response =
      NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );

    clearAuthCookies(response);
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
