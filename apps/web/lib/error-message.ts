export function extractMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object" || !("message" in payload)) {
    return fallback;
  }

  const message = (payload as { message?: string | string[] }).message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message ?? fallback;
}

export async function extractErrorFromResponse(response: Response, fallback: string): Promise<string> {
  try {
    const payload = await response.json();
    return extractMessage(payload, fallback);
  } catch {
    return fallback;
  }
}
