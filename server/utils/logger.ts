import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

type Level = 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>
type LogFile = 'app.log' | 'error.log'

const LOG_DIR = join(process.cwd(), 'logs')
const SENSITIVE_KEY = /pass(word)?|hash|token|secret|cookie|authorization|api_?key/i

function canWriteFiles(): boolean {
  try {
    mkdirSync(LOG_DIR, { recursive: true })
    return true
  } catch {
    return false
  }
}

let fileOutput = canWriteFiles()

function redact(context: LogContext): LogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [key, SENSITIVE_KEY.test(key) ? '[redacted]' : value])
  )
}

function describeError(error: unknown): LogContext {
  if (error instanceof Error) return { error: error.message, stack: error.stack }
  return error === undefined ? {} : { error: String(error) }
}

function write(file: LogFile, level: Level, message: string, context: LogContext): void {
  const line = `${JSON.stringify({ time: new Date().toISOString(), level, message, ...redact(context) })}\n`
  if (fileOutput) {
    try {
      appendFileSync(join(LOG_DIR, file), line)
      return
    } catch {
      fileOutput = false
    }
  }
  if (level === 'error') process.stderr.write(line)
  else process.stdout.write(line)
}

/** Shared application logger: app events to logs/app.log, failures to logs/error.log, stdout when the disk is read-only. */
export const logger = {
  info: (message: string, context: LogContext = {}) => write('app.log', 'info', message, context),
  warn: (message: string, context: LogContext = {}) => write('app.log', 'warn', message, context),
  error: (message: string, error?: unknown, context: LogContext = {}) =>
    write('error.log', 'error', message, { ...context, ...describeError(error) })
}
