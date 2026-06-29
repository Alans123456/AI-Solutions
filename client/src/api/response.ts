export function arrayResponse<T>(data: unknown, key: string): Record<string, T[]> {
  if (typeof data !== "object" || data === null || !Array.isArray((data as Record<string, unknown>)[key])) {
    throw new Error(
      `Invalid API response for "${key}". Check VITE_API_BASE_URL and make sure the backend API is deployed.`
    );
  }

  return { [key]: (data as Record<string, T[]>)[key] };
}

export function itemResponse<T>(data: unknown, key: string): Record<string, T> {
  if (typeof data !== "object" || data === null || !(key in data)) {
    throw new Error(
      `Invalid API response for "${key}". Check VITE_API_BASE_URL and make sure the backend API is deployed.`
    );
  }

  return { [key]: (data as Record<string, T>)[key] };
}
