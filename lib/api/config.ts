const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

export function getApiUrl(
  path: string
) {
  return `${API_URL}${path}`;
}