import type { H3Event } from 'h3'

const startedAt = new WeakMap<H3Event, number>()

function isAsset(path: string): boolean {
  return path.startsWith('/_') || path.startsWith('/favicon')
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    startedAt.set(event, Date.now())
  })

  nitroApp.hooks.hook('afterResponse', (event) => {
    const path = event.path.split('?')[0] ?? event.path
    if (isAsset(path)) return
    const user = event.context.adminUser
    logger.info('request', {
      method: event.method,
      path,
      status: getResponseStatus(event),
      durationMs: Date.now() - (startedAt.get(event) ?? Date.now()),
      userId: user?.id,
      role: user?.role
    })
  })

  nitroApp.hooks.hook('error', (error, { event }) => {
    const status = error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500
    if (status < 500) return
    logger.error('request.failed', error, { method: event?.method, path: event?.path.split('?')[0] })
  })
})
