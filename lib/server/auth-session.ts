import "server-only";

import type { NextResponse } from "next/server";

import { getApiUrl } from "@/lib/api/config";
import type { AuthTokensResponse } from "@/types/auth";

export const ACCESS_TOKEN_COOKIE =
  "laforesta_access_token";

export const REFRESH_TOKEN_COOKIE =
  "laforesta_refresh_token";

const cookieBase = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV ===
    "production",
  sameSite: "lax" as const,
  path: "/",
};

export class BackendUnavailableError extends Error {
  constructor() {
    super(
      "The account service is temporarily unavailable."
    );
    this.name =
      "BackendUnavailableError";
  }
}

export async function requestBackend(
  path: string,
  init?: RequestInit
) {
  try {
    return await fetch(
      getApiUrl(path),
      {
        ...init,
        cache: "no-store",
      }
    );
  } catch {
    throw new BackendUnavailableError();
  }
}

export async function readBackendBody(
  response: Response
) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {
      message:
        "The account service returned an invalid response.",
    };
  }
}

export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokensResponse
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    {
      ...cookieBase,
      maxAge:
        tokens.accessTokenExpiresIn,
    }
  );

  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 30,
    }
  );
}

export function clearAuthCookies(
  response: NextResponse
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    "",
    {
      ...cookieBase,
      maxAge: 0,
    }
  );

  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    "",
    {
      ...cookieBase,
      maxAge: 0,
    }
  );
}

export function isAuthTokensResponse(
  value: unknown
): value is AuthTokensResponse {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const tokens = value as Record<
    string,
    unknown
  >;

  return (
    typeof tokens.accessToken ===
      "string" &&
    typeof tokens.refreshToken ===
      "string" &&
    tokens.tokenType === "Bearer" &&
    typeof tokens.accessTokenExpiresIn ===
      "number"
  );
}

export async function refreshSession(
  refreshToken: string
) {
  const response = await requestBackend(
    "/api/auth/refresh",
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

  const body =
    await readBackendBody(response);

  if (
    !response.ok ||
    !isAuthTokensResponse(body)
  ) {
    return null;
  }

  return body;
}
