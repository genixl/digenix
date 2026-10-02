<template>
  <div>
    <section class="border-b border-default">
      <UContainer class="flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div class="max-w-3xl">
          <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
            Work
          </p>
          <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-7xl">
            Built, launched and still running.
          </h1>
        </div>
        <p class="max-w-sm text-lg text-muted">
          A selection of recent engagements, each measured against the goal agreed in week one.
        </p>
      </UContainer>
    </section>

    <UContainer class="flex flex-col py-8 lg:py-12">
      <article
        v-for="(study, index) in caseStudies"
        :id="study.slug"
        :key="study.slug"
        class="grid scroll-mt-24 grid-cols-1 items-start gap-8 border-b border-default py-12 last:border-b-0 lg:grid-cols-2 lg:gap-16 lg:py-16"
      >
        <div :class="index % 2 === 1 ? 'lg:order-last' : ''">
          <img
            :src="photoUrl(study.photo, 1200, 900)"
            :alt="study.photo.alt"
            width="1200"
            height="900"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            class="aspect-4/3 w-full object-cover"
          >
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-4xl font-bold text-secondary-600">{{ String(index + 1).padStart(2, '0') }}</span>
            <UBadge
              :label="study.sector"
              color="primary"
              variant="subtle"
            />
            <UBadge
              :label="String(study.year)"
              color="neutral"
              variant="outline"
            />
          </div>
          <div>
            <h2 class="text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl">
              {{ study.title }}
            </h2>
            <p class="mt-2 text-muted">
              {{ study.client }}
            </p>
          </div>

          <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt class="font-mono text-xs uppercase tracking-widest text-dimmed">
                Challenge
              </dt>
              <dd class="mt-2 text-default">
                {{ study.challenge }}
              </dd>
            </div>
            <div>
              <dt class="font-mono text-xs uppercase tracking-widest text-dimmed">
                Approach
              </dt>
              <dd class="mt-2 text-default">
                {{ study.approach }}
              </dd>
            </div>
          </dl>

          <dl class="grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-3">
            <div
              v-for="result in study.results"
              :key="result.label"
              class="flex flex-col bg-default p-4"
            >
              <dt class="text-sm text-muted">
                {{ result.label }}
              </dt>
              <dd class="order-first text-2xl font-bold tracking-tight text-primary">
                {{ result.value }}
              </dd>
            </div>
          </dl>

          <ul
            class="flex flex-wrap gap-2"
            aria-label="Technology used"
          >
            <li
              v-for="tool in study.stack"
              :key="tool"
            >
              <UBadge
                :label="tool"
                color="neutral"
                variant="soft"
              />
            </li>
          </ul>
        </div>
      </article>
    </UContainer>

    <CtaBand
      title="Your project could be the next one here."
      lead="Tell us the outcome you need and we will show you how we would measure it."
    />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Work',
  description: 'Case studies in logistics, healthcare, financial services and retail.'
})
</script>
