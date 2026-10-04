<template>
  <div>
    <UContainer
      v-if="error"
      class="py-12"
    >
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="This page could not be loaded"
        description="Please refresh in a moment."
      />
    </UContainer>

    <section
      v-if="sections?.hero"
      class="border-b border-default"
    >
      <UContainer class="flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div class="max-w-3xl">
          <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
            {{ sections.hero.eyebrow }}
          </p>
          <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-7xl">
            {{ sections.hero.title }}
          </h1>
        </div>
        <p
          v-if="sections.hero.body"
          class="max-w-sm text-lg text-muted"
        >
          {{ sections.hero.body }}
        </p>
      </UContainer>
    </section>

    <UContainer class="flex flex-col py-8 lg:py-12">
      <UEmpty
        v-if="!caseStudies.length"
        icon="i-lucide-briefcase"
        title="No case studies published yet"
        variant="naked"
        class="py-12"
      />
      <article
        v-for="(study, index) in caseStudies"
        :id="study.slug"
        :key="study.id"
        class="grid scroll-mt-24 grid-cols-1 items-start gap-8 border-b border-default py-12 last:border-b-0 lg:grid-cols-2 lg:gap-16 lg:py-16"
      >
        <div
          v-if="study.imageUrl"
          :class="index % 2 === 1 ? 'lg:order-last' : ''"
        >
          <img
            :src="sizedImage(study.imageUrl, 1200, 900)"
            :alt="study.imageAlt"
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

          <dl
            v-if="study.results.length"
            class="grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-3"
          >
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
            v-if="study.stack.length"
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
      v-if="sections?.cta"
      :title="sections.cta.title"
      :lead="sections.cta.body"
    />
  </div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/content/work')

const sections = computed(() => data.value?.sections)
const caseStudies = computed(() => data.value?.caseStudies ?? [])

usePageSeo({
  title: 'Work',
  seo: () => sections.value?.seo,
  fallback: () => sections.value?.hero
})
</script>
