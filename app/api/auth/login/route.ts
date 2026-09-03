import { NextResponse } from "next/server";

import {
  BackendUnavailableError,
  isAuthTokensResponse,
  readBackendBody,
  requestBackend,
  setAuthCookies,
} from "@/lib/server/auth-session";

export async function POST(
  request: Request
) {
  try {
    const requestBody =
      await request.json();

    const backendResponse =
      await requestBackend(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            requestBody
          ),
        }
      );

    const body =
      await readBackendBody(
        backendResponse
      );

    if (!backendResponse.ok) {
      return NextResponse.json(
        body,
        {
          status:
            backendResponse.status,
        }
      );
    }

    if (!isAuthTokensResponse(body)) {
      return NextResponse.json(
        {
          message:
            "The account service returned an invalid response.",
        },
        { status: 502 }
      );
    }

    const response =
      NextResponse.json({
        authenticated: true,
      });

    setAuthCookies(response, body);

    return response;
  } catch (caught) {
    return NextResponse.json(
      {
        message:
          caught instanceof
          BackendUnavailableError
            ? caught.message
            : "Unable to process login.",
      },
      { status: 503 }
    );
  }
}
