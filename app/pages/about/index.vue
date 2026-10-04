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
      <UContainer class="py-16 lg:py-28">
        <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
          <span
            class="size-3 bg-secondary"
            aria-hidden="true"
          />
          {{ sections.hero.eyebrow }}
        </p>
        <h1 class="mt-8 max-w-5xl text-4xl font-bold tracking-tighter text-balance text-highlighted md:text-6xl lg:text-7xl">
          {{ sections.hero.title }} <span class="text-primary">{{ sections.hero.highlight }}</span>
        </h1>
      </UContainer>
    </section>

    <template v-if="sections?.story">
      <UContainer class="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-24">
        <h2 class="text-2xl font-bold tracking-tight text-highlighted md:col-span-2 lg:col-span-4">
          {{ sections.story.title }}
        </h2>
        <p
          v-for="paragraph in paragraphs(sections.story.body)"
          :key="paragraph"
          class="text-lg text-muted lg:col-span-4"
        >
          {{ paragraph }}
        </p>
      </UContainer>

      <img
        v-if="sections.story.imageUrl"
        :src="sizedImage(sections.story.imageUrl, 1600, 700)"
        :alt="sections.story.imageAlt"
        width="1600"
        height="700"
        loading="lazy"
        decoding="async"
        class="aspect-video w-full object-cover md:aspect-21/9"
      >
    </template>

    <section
      v-if="principles.length"
      class="py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.principles"
          index="01"
          :eyebrow="sections.principles.eyebrow"
          :title="sections.principles.title"
          :lead="sections.principles.body"
        />
        <ol class="grid grid-cols-1 gap-px border border-default bg-border md:grid-cols-3">
          <li
            v-for="(principle, index) in principles"
            :key="principle.id"
            class="flex flex-col gap-4 bg-default p-8"
          >
            <span class="font-mono text-5xl font-bold text-secondary-600">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="text-2xl font-semibold text-highlighted">
              {{ principle.title }}
            </h3>
            <p class="text-muted">
              {{ principle.description }}
            </p>
          </li>
        </ol>
      </UContainer>
    </section>

    <section
      v-if="disciplines.length"
      class="border-t border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.disciplines"
          index="02"
          :eyebrow="sections.disciplines.eyebrow"
          :title="sections.disciplines.title"
          :lead="sections.disciplines.body"
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <UCard
            v-for="discipline in disciplines"
            :key="discipline.id"
          >
            <UIcon
              :name="discipline.icon"
              class="size-8 text-primary"
            />
            <h3 class="mt-4 text-lg font-semibold text-highlighted">
              {{ discipline.title }}
            </h3>
            <p class="mt-2 text-sm text-muted">
              {{ discipline.description }}
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <section
      v-if="teamMembers.length"
      class="border-t border-default py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.team"
          index="03"
          :eyebrow="sections.team.eyebrow"
          :title="sections.team.title"
          :lead="sections.team.body"
        />
        <ul class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="member in teamMembers"
            :key="member.id"
            class="flex flex-col gap-3"
          >
            <img
              v-if="member.imageUrl"
              :src="sizedImage(member.imageUrl, 600, 600)"
              :alt="member.imageAlt"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              class="aspect-square w-full object-cover"
            >
            <div>
              <h3 class="text-lg font-semibold text-highlighted">
                {{ member.name }}
              </h3>
              <p class="font-mono text-xs uppercase tracking-widest text-secondary-600">
                {{ member.role }}
              </p>
            </div>
            <p
              v-if="member.bio"
              class="text-sm text-muted"
            >
              {{ member.bio }}
            </p>
          </li>
        </ul>
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
const { data, error } = await useFetch('/api/content/about')

const sections = computed(() => data.value?.sections)
const principles = computed(() => data.value?.principles ?? [])
const disciplines = computed(() => data.value?.disciplines ?? [])
const teamMembers = computed(() => data.value?.teamMembers ?? [])

usePageSeo({
  title: 'About',
  seo: () => sections.value?.seo,
  fallback: () => sections.value?.story
})
</script>
