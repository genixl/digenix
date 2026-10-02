<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header>
        <AppLogo />
      </template>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />

      <template #footer>
        <div class="flex w-full flex-col gap-3">
          <div
            v-if="session?.user"
            class="flex flex-col"
          >
            <span class="truncate text-sm font-semibold text-highlighted">{{ session.user.name }}</span>
            <span class="font-mono text-xs uppercase tracking-widest text-muted">{{ session.user.role === 'admin_editor' ? 'Editor' : 'Viewer' }}</span>
          </div>
          <UButton
            label="Sign out"
            icon="i-lucide-log-out"
            color="neutral"
            variant="outline"
            block
            :loading="status === 'pending'"
            @click="signOut"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { InternalApi } from 'nitropack/types'

useSeoMeta({ robots: 'noindex, nofollow' })

const { data: session } = useNuxtData<InternalApi['/api/auth/session']['get']>('admin-session')

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Overview', icon: 'i-lucide-layout-dashboard', to: '/admin', exact: true },
  ...Object.entries(adminResourceMeta).map(([name, meta]) => ({ label: meta.label, icon: meta.icon, to: `/admin/${name}` }))
])

const { status, execute } = useFetch('/api/auth/logout', {
  method: 'POST',
  immediate: false,
  watch: false
})

async function signOut(): Promise<void> {
  await execute()
  clearNuxtData('admin-session')
  await navigateTo('/admin/login')
}
</script>
