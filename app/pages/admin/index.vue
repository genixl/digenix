<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Overview" />
    </template>

    <template #body>
      <p class="text-muted">
        Everything on the public site comes from these collections. {{ isEditor ? 'Choose one to add or edit content.' : 'You have read-only access.' }}
      </p>
      <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="[name, meta] in resources"
          :key="name"
        >
          <UButton
            :to="`/admin/${name}`"
            :label="meta.label"
            :icon="meta.icon"
            color="neutral"
            variant="outline"
            size="xl"
            trailing-icon="i-lucide-arrow-right"
            block
          />
        </li>
      </ul>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { InternalApi } from 'nitropack/types'

// UDashboardPanel renders multiple root nodes, which an out-in page transition cannot mount.
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false })
useSeoMeta({ title: 'Admin' })

const { data: session } = useNuxtData<InternalApi['/api/auth/session']['get']>('admin-session')
const isEditor = computed(() => session.value?.user?.role === 'admin_editor')
const resources = Object.entries(adminResourceMeta)
</script>
