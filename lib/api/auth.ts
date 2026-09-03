import type {
  CurrentUser,
  RegisterResponse,
} from "@/types/auth";

export class AuthApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function readResponse<T>(
  response: Response,
  fallback: string
): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallback;

    throw new AuthApiError(
      message,
      response.status
    );
  }

  return body as T;
}

async function postAuth<T>(
  action: string,
  body?: unknown
) {
  const response = await fetch(
    `/api/auth/${action}`,
    {
      method: "POST",
      headers: body
        ? {
            "Content-Type":
              "application/json",
          }
        : undefined,
      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  return readResponse<T>(
    response,
    "Unable to process this request."
  );
}

export function login(
  email: string,
  password: string
) {
  return postAuth<{
    authenticated: true;
  }>("login", {
    email,
    password,
  });
}

export function register(
  fullName: string,
  email: string,
  password: string
) {
  return postAuth<RegisterResponse>(
    "register",
    {
      fullName,
      email,
      password,
    }
  );
}

export function verifyEmail(
  token: string
) {
  return postAuth<void>(
    "verify-email",
    { token }
  );
}

export function resendVerification(
  email: string
) {
  return postAuth<void>(
    "resend-verification",
    { email }
  );
}

export function requestPasswordReset(
  email: string
) {
  return postAuth<void>(
    "forgot-password",
    { email }
  );
}

export function resetPassword(
  token: string,
  newPassword: string
) {
  return postAuth<void>(
    "reset-password",
    {
      token,
      newPassword,
    }
  );
}

export function logout() {
  return postAuth<void>("logout");
}

export async function getCurrentUser() {
  const response = await fetch(
    "/api/auth/me",
    {
      cache: "no-store",
    }
  );

  return readResponse<CurrentUser>(
    response,
    "Unable to load your account."
  );
}
