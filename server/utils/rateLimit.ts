interface AttemptWindow {
  count: number
  resetAt: number
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5
const failures = new Map<string, AttemptWindow>()

function activeWindow(key: string, now: number): AttemptWindow | undefined {
  const attempts = failures.get(key)
  if (attempts && attempts.resetAt <= now) {
    failures.delete(key)
    return undefined
  }
  return attempts
}

/** Basic in-memory limiter for failed login attempts, keyed by client IP. */
export const loginRateLimit = {
  isBlocked(key: string, now = Date.now()): boolean {
    return (activeWindow(key, now)?.count ?? 0) >= MAX_FAILURES
  },
  recordFailure(key: string, now = Date.now()): void {
    const attempts = activeWindow(key, now)
    if (attempts) attempts.count++
    else failures.set(key, { count: 1, resetAt: now + WINDOW_MS })
  },
  reset(key: string): void {
    failures.delete(key)
  }
}
