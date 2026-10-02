<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
    leave-to-class="opacity-0"
  >
    <div
      v-if="status === 'success' && data"
      class="flex flex-col items-start gap-4"
      role="status"
    >
      <UIcon
        name="i-lucide-circle-check"
        class="size-10 text-primary"
      />
      <h3 class="text-2xl font-bold tracking-tight text-highlighted">
        Thanks, we have your brief.
      </h3>
      <p class="text-muted">
        A senior engineer will reply within one business day. Your reference is
        <span class="font-mono text-highlighted">{{ data.reference.slice(0, 8) }}</span>.
      </p>
      <UButton
        label="Send another inquiry"
        color="neutral"
        variant="outline"
        icon="i-lucide-rotate-ccw"
        @click="reset"
      />
    </div>

    <UForm
      v-else
      :schema="contactSchema"
      :state="state"
      class="grid grid-cols-1 gap-5 md:grid-cols-2"
      @submit="onSubmit"
    >
      <UFormField
        label="Name"
        name="name"
        required
      >
        <UInput
          v-model="state.name"
          autocomplete="name"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Work email"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Company"
        name="company"
        required
      >
        <UInput
          v-model="state.company"
          autocomplete="organization"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="What do you need?"
        name="service"
        required
      >
        <USelect
          v-model="state.service"
          :items="serviceItems"
          placeholder="Choose a service"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Project details"
        name="message"
        description="Goals, timeline and anything already built."
        required
        class="md:col-span-2"
      >
        <UTextarea
          v-model="state.message"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="status === 'error'"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="Your message was not sent"
        :description="error?.statusMessage ?? 'Please try again in a moment.'"
        class="md:col-span-2"
      />

      <div class="md:col-span-2">
        <UButton
          type="submit"
          label="Send inquiry"
          trailing-icon="i-lucide-send"
          size="lg"
          :loading="status === 'pending'"
        />
      </div>
    </UForm>
  </Transition>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { contactSchema, contactServices, type ContactPayload } from '~~/server/utils/contactSchema'

const serviceItems = [...contactServices]

const state = reactive<Partial<ContactPayload>>({})
const payload = ref<ContactPayload>()

const { data, status, error, execute, clear } = useFetch('/api/contact', {
  method: 'POST',
  body: payload,
  immediate: false,
  watch: false
})

async function onSubmit(event: FormSubmitEvent<ContactPayload>): Promise<void> {
  payload.value = event.data
  await execute()
}

function reset(): void {
  for (const key of Object.keys(state) as (keyof ContactPayload)[]) {
    state[key] = undefined
  }
  clear()
}
</script>
