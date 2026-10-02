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
      <UContainer class="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 lg:py-20">
        <div>
          <p class="font-mono text-sm uppercase tracking-widest text-secondary-600">
            {{ sections.hero.eyebrow }}
          </p>
          <h1 class="mt-4 text-5xl font-bold tracking-tighter text-balance text-highlighted lg:text-7xl">
            {{ sections.hero.title }}
          </h1>
          <p
            v-if="sections.hero.body"
            class="mt-6 max-w-xl text-lg text-muted"
          >
            {{ sections.hero.body }}
          </p>
        </div>
        <img
          v-if="sections.hero.imageUrl"
          :src="sizedImage(sections.hero.imageUrl, 1000, 1000)"
          :alt="sections.hero.imageAlt"
          width="1000"
          height="1000"
          class="mx-auto w-full max-w-md"
        >
      </UContainer>
    </section>

    <UContainer
      v-if="!services.length"
      class="py-16 lg:py-24"
    >
      <UEmpty
        icon="i-lucide-layers"
        title="No services published yet"
        variant="naked"
      />
    </UContainer>

    <UContainer
      v-else
      class="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-24"
    >
      <nav
        aria-label="Services on this page"
        class="hidden lg:col-span-4 lg:block"
      >
        <ol class="sticky top-24 flex flex-col border-l border-default">
          <li
            v-for="(service, index) in services"
            :key="service.id"
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
          :key="service.id"
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
          <ul
            v-if="service.deliverables.length"
            class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
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
          <p
            v-if="service.timeline"
            class="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted"
          >
            <UIcon
              name="i-lucide-clock"
              class="size-4"
            />
            {{ service.timeline }}
          </p>
        </article>
      </div>
    </UContainer>

    <section
      v-if="engagementModels.length"
      class="border-t border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.engagement"
          index="08"
          :eyebrow="sections.engagement.eyebrow"
          :title="sections.engagement.title"
          :lead="sections.engagement.body"
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <UCard
            v-for="model in engagementModels"
            :key="model.id"
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
            <p
              v-if="model.bestFor"
              class="mt-4 font-mono text-xs uppercase tracking-widest text-secondary-600"
            >
              {{ model.bestFor }}
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <CtaBand
      v-if="sections?.cta"
      :title="sections.cta.title"
      :lead="sections.cta.body"
    />
  </div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/content/services')

const sections = computed(() => data.value?.sections)
const services = computed(() => data.value?.services ?? [])
const engagementModels = computed(() => data.value?.engagementModels ?? [])

useSeoMeta({
  title: 'Services',
  description: () => sections.value?.hero?.body
})
</script>
