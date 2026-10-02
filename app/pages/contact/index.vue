<template>
  <UContainer class="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
    <div class="flex flex-col gap-10 lg:col-span-5">
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="This page could not be loaded"
        description="Please refresh in a moment."
      />

      <div v-if="sections?.hero">
        <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
          {{ sections.hero.eyebrow }}
        </p>
        <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-6xl">
          {{ sections.hero.title }}
        </h1>
        <p
          v-if="sections.hero.body"
          class="mt-6 text-lg text-muted"
        >
          {{ sections.hero.body }}
        </p>
      </div>

      <ol
        v-if="contactSteps.length"
        class="flex flex-col border-l-2 border-accented"
      >
        <li
          v-for="(step, index) in contactSteps"
          :key="step.id"
          class="relative flex flex-col gap-1 pb-6 pl-6 last:pb-0"
        >
          <span class="font-mono text-xs uppercase tracking-widest text-secondary-600">Step {{ index + 1 }}</span>
          <h2 class="font-semibold text-highlighted">
            {{ step.title }}
          </h2>
          <p class="text-sm text-muted">
            {{ step.description }}
          </p>
        </li>
      </ol>

      <UAccordion
        v-if="faqs.length"
        :items="faqs"
      />
    </div>

    <UCard class="self-start lg:col-span-7">
      <template #header>
        <h2 class="text-xl font-semibold text-highlighted">
          Project brief
        </h2>
      </template>
      <ContactForm
        v-if="services.length"
        :services="services"
      />
      <UEmpty
        v-else
        icon="i-lucide-inbox"
        title="Inquiries are not open yet"
        variant="naked"
      />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const { data, error } = await useFetch('/api/content/contact')

const sections = computed(() => data.value?.sections)
const contactSteps = computed(() => data.value?.contactSteps ?? [])
const services = computed(() => data.value?.services ?? [])
const faqs = computed<AccordionItem[]>(() =>
  (data.value?.faqs ?? []).map(faq => ({ label: faq.question, content: faq.answer }))
)

useSeoMeta({
  title: 'Contact',
  description: () => sections.value?.hero?.body
})
</script>
