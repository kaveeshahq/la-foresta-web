import "server-only";

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
import type { AuthTokensResponse } from "@/types/auth";

async function toNextResponse(
  backendResponse: Response,
  tokens?: AuthTokensResponse
) {
  const body =
    await readBackendBody(
      backendResponse
    );

  const response =
    body === null
      ? new NextResponse(null, {
          status:
            backendResponse.status,
        })
      : NextResponse.json(body, {
          status:
            backendResponse.status,
        });

  if (tokens) {
    setAuthCookies(response, tokens);
  }

  if (backendResponse.status === 401) {
    clearAuthCookies(response);
  }

  return response;
}

export async function proxyCustomerRequest(
  path: string,
  init?: RequestInit
) {
  try {
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get(
        ACCESS_TOKEN_COOKIE
      )?.value;
    const refreshToken =
      cookieStore.get(
        REFRESH_TOKEN_COOKIE
      )?.value;

    if (accessToken) {
      const backendResponse =
        await requestBackend(path, {
          ...init,
          headers: {
            ...init?.headers,
            Authorization:
              `Bearer ${accessToken}`,
          },
        });

      if (
        backendResponse.status !==
          401 ||
        !refreshToken
      ) {
        return toNextResponse(
          backendResponse
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
          await requestBackend(path, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization:
                `Bearer ${tokens.accessToken}`,
            },
          });

        return toNextResponse(
          backendResponse,
          tokens
        );
      }
    }

    const response =
      NextResponse.json(
        {
          message:
            "Sign in to continue.",
        },
        { status: 401 }
      );

    clearAuthCookies(response);
    return response;
  } catch {
    return NextResponse.json(
      {
        message:
          "The ticketing service is temporarily unavailable.",
      },
      { status: 503 }
    );
  }
}
