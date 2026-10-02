<template>
  <UContainer class="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
    <div class="flex flex-col gap-10 lg:col-span-5">
      <div>
        <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
          Contact
        </p>
        <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-6xl">
          Start a project.
        </h1>
        <p class="mt-6 text-lg text-muted">
          Tell us where you are and where you want to be. There is no obligation and no sales script.
        </p>
      </div>

      <ol class="flex flex-col border-l-2 border-accented">
        <li
          v-for="(step, index) in nextSteps"
          :key="step.title"
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

      <UAccordion :items="faqs" />
    </div>

    <UCard class="self-start lg:col-span-7">
      <template #header>
        <h2 class="text-xl font-semibold text-highlighted">
          Project brief
        </h2>
      </template>
      <ContactForm />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

useSeoMeta({
  title: 'Contact',
  description: `Start a project with ${siteName}. A senior engineer replies within one business day.`
})

const nextSteps = [
  {
    title: 'We reply within one business day',
    description: 'A senior engineer reads your brief and comes back with questions, not a template.'
  },
  {
    title: 'A free 30-minute technical call',
    description: 'We dig into goals, constraints and existing systems, and tell you honestly if we are the right fit.'
  },
  {
    title: 'A scoped plan and fixed quote',
    description: 'Within a week you receive milestones, timelines and a price for each milestone.'
  }
]

const faqs: AccordionItem[] = [
  {
    label: 'How much does a project cost?',
    content: 'It depends on scope, so we price every milestone up front after the discovery call. You see the full cost before any work starts, and you can stop after any milestone.'
  },
  {
    label: 'Can you take over an existing codebase?',
    content: 'Yes. We start with a one-to-two-week audit covering architecture, security and test coverage, then propose a plan to stabilise and extend it.'
  },
  {
    label: 'Will you sign an NDA?',
    content: 'Of course. Send yours with your brief or ask for ours, and we will sign it before the first call.'
  },
  {
    label: 'Who owns the code?',
    content: 'You do, from day one. Repositories, cloud accounts and design files are created in your organisation, not ours.'
  }
]
</script>
