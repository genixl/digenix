/** Verifies the admin session through the server on every admin navigation; client state is never trusted. */
export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useFetch('/api/auth/session', { key: 'admin-session' })
  if (!data.value?.user) return navigateTo('/admin/login')
})
