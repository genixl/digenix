<template>
  <UContainer class="flex min-h-screen items-center justify-center py-12">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex flex-col gap-4">
          <AppLogo />
          <h1 class="text-2xl font-bold tracking-tight text-highlighted">
            Admin sign in
          </h1>
        </div>
      </template>

      <UForm
        :schema="loginSchema"
        :state="state"
        class="flex flex-col gap-5"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="username"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="status === 'error'"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="error?.statusMessage ?? 'Sign in failed'"
        />

        <UButton
          type="submit"
          label="Sign in"
          icon="i-lucide-log-in"
          size="lg"
          block
          :loading="status === 'pending'"
        />
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginInput } from '#shared/schemas/auth'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Sign in', robots: 'noindex, nofollow' })

const state = reactive<Partial<LoginInput>>({})
const payload = ref<LoginInput>()

const { status, error, execute } = useFetch('/api/auth/login', {
  method: 'POST',
  body: payload,
  immediate: false,
  watch: false
})

async function onSubmit(event: FormSubmitEvent<LoginInput>): Promise<void> {
  payload.value = event.data
  await execute()
  if (status.value === 'success') await navigateTo('/admin')
}
</script>
