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
      v-if="sections?.hero || heroTiles.length"
      class="border-b border-default"
    >
      <UContainer class="grid grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:py-24">
        <div
          v-if="sections?.hero"
          class="lg:col-span-6"
        >
          <UBadge
            v-if="sections.hero.eyebrow"
            :label="sections.hero.eyebrow"
            color="secondary"
            variant="subtle"
            icon="i-lucide-sparkles"
          />
          <h1 class="mt-6 text-5xl font-bold tracking-tighter text-balance text-highlighted md:text-6xl lg:text-7xl">
            {{ sections.hero.title }} <span class="text-primary">{{ sections.hero.highlight }}</span>
          </h1>
          <p
            v-if="sections.hero.body"
            class="mt-6 max-w-xl text-lg text-pretty text-muted md:text-xl"
          >
            {{ sections.hero.body }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton
              label="Start a project"
              to="/contact"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              label="See our work"
              to="/work"
              size="xl"
              color="neutral"
              variant="outline"
            />
          </div>
          <dl
            v-if="heroMetrics.length"
            class="mt-10 grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-3"
          >
            <div
              v-for="metric in heroMetrics"
              :key="metric.id"
              class="flex flex-col bg-default p-4"
            >
              <dt class="text-sm text-muted">
                {{ metric.label }}
              </dt>
              <dd class="order-first text-2xl font-bold tracking-tight text-highlighted">
                {{ metric.value }}
              </dd>
            </div>
          </dl>
        </div>
        <div
          v-if="heroTiles.length"
          class="lg:col-span-6"
        >
          <ImageCollage
            :visuals="heroTiles"
            :caption="sections?.gallery?.eyebrow"
          />
        </div>
      </UContainer>
    </section>

    <section
      id="services"
      class="py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.services"
          index="01"
          :eyebrow="sections.services.eyebrow"
          :title="sections.services.title"
          :lead="sections.services.body"
        />
        <UEmpty
          v-if="!services.length"
          icon="i-lucide-layers"
          title="No services published yet"
          variant="naked"
        />
        <ul
          v-else
          class="grid grid-cols-1 gap-px border border-default bg-border md:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="(service, index) in services"
            :key="service.id"
          >
            <NuxtLink
              :to="`/services#${service.slug}`"
              class="group flex h-full flex-col gap-4 bg-default p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
            >
              <div class="flex items-center justify-between">
                <UIcon
                  :name="service.icon"
                  class="size-7 text-primary"
                />
                <span class="font-mono text-xs text-dimmed">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <h3 class="text-lg font-semibold text-highlighted">
                {{ service.title }}
              </h3>
              <p class="text-sm text-muted">
                {{ service.summary }}
              </p>
              <span class="mt-auto flex items-center gap-1 text-sm font-semibold text-primary">
                Explore
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </NuxtLink>
          </li>
          <li
            v-if="sections?.servicesCta"
            class="flex flex-col justify-between gap-6 bg-primary-900 p-6 text-inverted"
          >
            <p class="text-lg font-semibold">
              {{ sections.servicesCta.title }}
            </p>
            <UButton
              label="Book a call"
              to="/contact"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-arrow-up-right"
              class="self-start"
            />
          </li>
        </ul>
      </UContainer>
    </section>

    <section
      v-if="processSteps.length"
      class="border-y border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.process"
          index="02"
          :eyebrow="sections.process.eyebrow"
          :title="sections.process.title"
          :lead="sections.process.body"
        />
        <ol class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
          <li
            v-for="(step, index) in processSteps"
            :key="step.id"
            class="flex flex-col gap-3 border-l-2 border-accented pl-6 transition-colors hover:border-secondary motion-reduce:transition-none lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-6"
          >
            <span class="font-mono text-3xl font-bold text-secondary-600">{{ String(index + 1).padStart(2, '0') }}</span>
            <UBadge
              :label="step.duration"
              color="neutral"
              variant="outline"
              class="self-start"
            />
            <h3 class="text-xl font-semibold text-highlighted">
              {{ step.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ step.description }}
            </p>
            <p class="mt-auto flex items-start gap-2 text-sm font-medium text-default">
              <UIcon
                name="i-lucide-file-check-2"
                class="mt-0.5 size-4 shrink-0 text-primary"
              />
              {{ step.output }}
            </p>
          </li>
        </ol>
      </UContainer>
    </section>

    <section
      v-if="techStack.length"
      class="bg-primary-900 py-16 text-inverted lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <header
          v-if="sections?.technology"
          class="grid gap-4 lg:grid-cols-12 lg:gap-8"
        >
          <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-primary-200 lg:col-span-3 lg:pt-3">
            <span class="text-secondary-300">03</span>
            <span>{{ sections.technology.eyebrow }}</span>
          </p>
          <div class="lg:col-span-9">
            <h2 class="text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl">
              {{ sections.technology.title }}
            </h2>
            <p
              v-if="sections.technology.body"
              class="mt-4 max-w-2xl text-lg text-primary-100"
            >
              {{ sections.technology.body }}
            </p>
          </div>
        </header>
        <div class="grid grid-cols-1 gap-px bg-primary-700 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="group in techStack"
            :key="group.label"
            class="bg-primary-900 p-6"
          >
            <h3 class="font-mono text-xs uppercase tracking-widest text-secondary-300">
              {{ group.label }}
            </h3>
            <ul class="mt-4 flex flex-wrap gap-2">
              <li
                v-for="tool in group.tools"
                :key="tool.name"
                class="flex items-center gap-2 border border-primary-700 px-3 py-2 text-sm"
              >
                <UIcon
                  :name="tool.icon"
                  class="size-4"
                />
                {{ tool.name }}
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </section>

    <section
      v-if="caseStudies.length"
      class="py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          v-if="sections?.work"
          index="04"
          :eyebrow="sections.work.eyebrow"
          :title="sections.work.title"
          :lead="sections.work.body"
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(study, index) in caseStudies"
            :key="study.id"
            :to="`/work#${study.slug}`"
            class="group flex flex-col border border-default bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''"
          >
            <div
              v-if="study.imageUrl"
              class="overflow-hidden"
            >
              <img
                :src="sizedImage(study.imageUrl, 800, 600)"
                :alt="study.imageAlt"
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
                class="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              >
            </div>
            <div class="flex flex-1 flex-col gap-3 p-6">
              <p class="font-mono text-xs uppercase tracking-widest text-muted">
                {{ study.sector }} · {{ study.year }}
              </p>
              <h3 class="text-xl font-semibold text-highlighted">
                {{ study.title }}
              </h3>
              <p class="text-sm text-muted">
                {{ study.summary }}
              </p>
              <p
                v-if="study.results[0]"
                class="mt-auto pt-4 text-sm text-default"
              >
                <span class="text-2xl font-bold tracking-tight text-primary">{{ study.results[0].value }}</span>
                {{ study.results[0].label }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <UButton
          label="All case studies"
          to="/work"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
          class="self-start"
        />
      </UContainer>
    </section>

    <section
      v-if="metrics.length || commitments.length"
      class="border-y border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div class="flex flex-col gap-10 lg:col-span-5">
          <div v-if="sections?.whyUs">
            <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
              <span class="text-secondary-600">05</span>
              <span>{{ sections.whyUs.eyebrow }}</span>
            </p>
            <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl lg:text-5xl">
              {{ sections.whyUs.title }}
            </h2>
          </div>
          <dl
            v-if="metrics.length"
            class="grid grid-cols-2 gap-px border border-default bg-border"
          >
            <div
              v-for="metric in metrics"
              :key="metric.id"
              class="flex flex-col bg-default p-5"
            >
              <dt class="text-sm text-muted">
                {{ metric.label }}
              </dt>
              <dd class="order-first text-3xl font-bold tracking-tight text-highlighted">
                {{ metric.value }}
              </dd>
            </div>
          </dl>
        </div>
        <ul class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-7">
          <li
            v-for="commitment in commitments"
            :key="commitment.id"
            class="flex flex-col gap-3"
          >
            <span class="flex size-12 items-center justify-center bg-primary text-inverted">
              <UIcon
                :name="commitment.icon"
                class="size-6"
              />
            </span>
            <h3 class="text-xl font-semibold text-highlighted">
              {{ commitment.title }}
            </h3>
            <p class="text-muted">
              {{ commitment.description }}
            </p>
          </li>
        </ul>
      </UContainer>
    </section>

    <section
      v-if="sections?.team"
      class="py-16 lg:py-24"
    >
      <UContainer class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <img
          v-if="sections.team.imageUrl"
          :src="sizedImage(sections.team.imageUrl, 1200, 900)"
          :alt="sections.team.imageAlt"
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
          class="aspect-4/3 w-full object-cover"
        >
        <div class="flex flex-col gap-8">
          <div>
            <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
              <span class="text-secondary-600">06</span>
              <span>{{ sections.team.eyebrow }}</span>
            </p>
            <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl">
              {{ sections.team.title }}
            </h2>
            <p
              v-if="sections.team.body"
              class="mt-4 text-lg text-muted"
            >
              {{ sections.team.body }}
            </p>
          </div>
          <ul
            v-if="disciplines.length"
            class="grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-2"
          >
            <li
              v-for="discipline in disciplines"
              :key="discipline.id"
              class="flex items-center gap-3 bg-default p-4"
            >
              <UIcon
                :name="discipline.icon"
                class="size-5 shrink-0 text-secondary-600"
              />
              <span class="font-semibold text-highlighted">{{ discipline.title }}</span>
            </li>
          </ul>
          <UButton
            label="Meet the studio"
            to="/about"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-right"
            class="self-start"
          />
        </div>
      </UContainer>
    </section>

    <section
      v-if="services.length"
      id="contact"
      class="border-t border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div
          v-if="sections?.contact"
          class="lg:col-span-5"
        >
          <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
            <span class="text-secondary-600">07</span>
            <span>{{ sections.contact.eyebrow }}</span>
          </p>
          <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl lg:text-5xl">
            {{ sections.contact.title }}
          </h2>
          <p
            v-if="sections.contact.body"
            class="mt-4 text-lg text-muted"
          >
            {{ sections.contact.body }}
          </p>
        </div>
        <UCard class="lg:col-span-7">
          <ContactForm :services="services.map(service => service.title)" />
        </UCard>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/content/home')

const sections = computed(() => data.value?.sections)
const heroTiles = computed(() => data.value?.heroTiles ?? [])
const metrics = computed(() => data.value?.metrics ?? [])
const heroMetrics = computed(() => metrics.value.filter(metric => metric.showInHero).slice(0, 3))
const services = computed(() => data.value?.services ?? [])
const processSteps = computed(() => data.value?.processSteps ?? [])
const techStack = computed(() => data.value?.techStack ?? [])
const caseStudies = computed(() => data.value?.caseStudies ?? [])
const commitments = computed(() => data.value?.commitments ?? [])
const disciplines = computed(() => data.value?.disciplines ?? [])

useSeoMeta({
  description: () => sections.value?.hero?.body
})
</script>
