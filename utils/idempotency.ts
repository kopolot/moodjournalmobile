/** Client-side key for safe retries of mutating POSTs (matches API 8–128 charset). */
export function createIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const rand = Math.random().toString(36).slice(2, 10);
  return `idem-${Date.now()}-${rand}`;
}
