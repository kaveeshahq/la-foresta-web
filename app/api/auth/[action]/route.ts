import { NextResponse } from "next/server";

import {
  BackendUnavailableError,
  readBackendBody,
  requestBackend,
} from "@/lib/server/auth-session";

const publicActions = new Set([
  "register",
  "verify-email",
  "resend-verification",
  "forgot-password",
  "reset-password",
]);

type AuthActionRouteProps = {
  params: Promise<{
    action: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: AuthActionRouteProps
) {
  const { action } = await params;

  if (!publicActions.has(action)) {
    return NextResponse.json(
      { message: "Not found." },
      { status: 404 }
    );
  }

  try {
    const requestBody =
      await request.json();

    const backendResponse =
      await requestBackend(
        `/api/auth/${action}`,
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

    if (body === null) {
      return new NextResponse(null, {
        status: backendResponse.status,
      });
    }

    return NextResponse.json(body, {
      status: backendResponse.status,
    });
  } catch (caught) {
    return NextResponse.json(
      {
        message:
          caught instanceof
          BackendUnavailableError
            ? caught.message
            : "Unable to process this request.",
      },
      { status: 503 }
    );
  }
}
