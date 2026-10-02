<template>
  <div>
    <section class="border-b border-default">
      <UContainer class="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 lg:py-20">
        <div>
          <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
            Services
          </p>
          <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-7xl">
            Seven disciplines. One accountable team.
          </h1>
          <p class="mt-6 max-w-xl text-lg text-muted">
            Bring us a single problem or an entire product. Each service works on its own, and they are designed to hand over cleanly to one another.
          </p>
        </div>
        <img
          :src="illustration"
          alt="Illustration of a monitor surrounded by cloud, server and messaging icons"
          width="2000"
          height="2000"
          class="mx-auto w-full max-w-md"
        >
      </UContainer>
    </section>

    <UContainer class="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-24">
      <nav
        aria-label="Services on this page"
        class="hidden lg:col-span-4 lg:block"
      >
        <ol class="sticky top-24 flex flex-col border-l border-default">
          <li
            v-for="(service, index) in services"
            :key="service.slug"
          >
            <ULink
              :to="`#${service.slug}`"
              class="flex items-baseline gap-3 py-2 pl-4 text-muted hover:text-highlighted"
            >
              <span class="font-mono text-xs text-secondary-600">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ service.title }}
            </ULink>
          </li>
        </ol>
      </nav>

      <div class="flex flex-col divide-y divide-default lg:col-span-8">
        <article
          v-for="(service, index) in services"
          :id="service.slug"
          :key="service.slug"
          class="scroll-mt-24 py-10 first:pt-0"
        >
          <div class="flex items-center gap-4">
            <span class="flex size-12 items-center justify-center bg-primary text-inverted">
              <UIcon
                :name="service.icon"
                class="size-6"
              />
            </span>
            <span class="font-mono text-sm text-dimmed">{{ String(index + 1).padStart(2, '0') }} / {{ String(services.length).padStart(2, '0') }}</span>
          </div>
          <h2 class="mt-6 text-3xl font-bold tracking-tighter text-highlighted md:text-4xl">
            {{ service.title }}
          </h2>
          <p class="mt-4 max-w-2xl text-lg text-muted">
            {{ service.summary }}
          </p>
          <ul class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li
              v-for="deliverable in service.deliverables"
              :key="deliverable"
              class="flex items-start gap-2 text-default"
            >
              <UIcon
                name="i-lucide-check"
                class="mt-1 size-4 shrink-0 text-secondary-600"
              />
              {{ deliverable }}
            </li>
          </ul>
          <p class="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <UIcon
              name="i-lucide-clock"
              class="size-4"
            />
            {{ service.timeline }}
          </p>
        </article>
      </div>
    </UContainer>

    <section class="border-t border-default bg-muted py-16 lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="08"
          eyebrow="Engagement models"
          title="Pick the shape that fits your budget."
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <UCard
            v-for="model in engagementModels"
            :key="model.title"
          >
            <UIcon
              :name="model.icon"
              class="size-8 text-primary"
            />
            <h3 class="mt-4 text-xl font-semibold text-highlighted">
              {{ model.title }}
            </h3>
            <p class="mt-2 text-muted">
              {{ model.description }}
            </p>
            <p class="mt-4 font-mono text-xs uppercase tracking-widest text-secondary-600">
              {{ model.bestFor }}
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <CtaBand
      title="Have a brief, or just a problem?"
      lead="Either works. We will help you turn it into a scoped, priced plan within a week."
    />
  </div>
</template>

<script setup lang="ts">
import illustration from '~/assets/images/SW4.jpg'

useSeoMeta({
  title: 'Services',
  description: 'Web platforms, mobile apps, cloud and DevOps, UI/UX design, AI and automation, technical consulting, and maintenance.'
})

const engagementModels = [
  {
    title: 'Fixed-scope project',
    icon: 'i-lucide-flag',
    description: 'A defined outcome split into priced milestones. You approve each demo before the next milestone begins.',
    bestFor: 'Best for new products and MVPs'
  },
  {
    title: 'Dedicated squad',
    icon: 'i-lucide-users',
    description: 'A cross-functional team working inside your roadmap and rituals, billed monthly and scaled up or down with notice.',
    bestFor: 'Best for ongoing product development'
  },
  {
    title: 'Care retainer',
    icon: 'i-lucide-shield-check',
    description: 'A monthly block of engineering hours for updates, fixes and improvements, with agreed response times.',
    bestFor: 'Best for software already in production'
  }
]
</script>
