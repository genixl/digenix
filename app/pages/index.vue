<template>
  <div>
    <section class="border-b border-default">
      <UContainer class="grid grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:py-24">
        <div class="lg:col-span-6">
          <UBadge
            label="Software development studio"
            color="secondary"
            variant="subtle"
            icon="i-lucide-sparkles"
          />
          <h1 class="mt-6 text-5xl font-bold tracking-tighter text-balance text-highlighted md:text-6xl lg:text-7xl">
            Expand your business <span class="text-primary">beyond horizons.</span>
          </h1>
          <p class="mt-6 max-w-xl text-lg text-pretty text-muted md:text-xl">
            We design, build and run custom software (web platforms, mobile apps, cloud infrastructure and AI tooling) on committed timelines, so you always know what ships and when.
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
          <dl class="mt-10 grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-3">
            <div
              v-for="point in proofPoints.slice(0, 3)"
              :key="point.label"
              class="flex flex-col bg-default p-4"
            >
              <dt class="text-sm text-muted">
                {{ point.label }}
              </dt>
              <dd class="order-first text-2xl font-bold tracking-tight text-highlighted">
                {{ point.value }}
              </dd>
            </div>
          </dl>
        </div>
        <div class="lg:col-span-6">
          <ImageCollage />
        </div>
      </UContainer>
    </section>

    <section
      id="services"
      class="py-16 lg:py-24"
    >
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="01"
          eyebrow="Services"
          title="Everything it takes to ship and run software."
          lead="One accountable team from the first workshop to the thousandth deploy, so nothing falls between vendors."
        />
        <ul class="grid grid-cols-1 gap-px border border-default bg-border md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(service, index) in services"
            :key="service.slug"
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
          <li class="flex flex-col justify-between gap-6 bg-primary-900 p-6 text-inverted">
            <p class="text-lg font-semibold">
              Not sure where your project fits? Book a 30-minute technical call.
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

    <section class="border-y border-default bg-muted py-16 lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="02"
          eyebrow="Process"
          title="Five steps from first call to production."
          lead="Each step ends with something you can see and sign off, and every milestone is priced before it starts."
        />
        <ol class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
          <li
            v-for="(step, index) in processSteps"
            :key="step.title"
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

    <section class="bg-primary-900 py-16 text-inverted lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <header class="grid gap-4 lg:grid-cols-12 lg:gap-8">
          <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-primary-200 lg:col-span-3 lg:pt-3">
            <span class="text-secondary-300">03</span>
            <span>Technology</span>
          </p>
          <div class="lg:col-span-9">
            <h2 class="text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl">
              Proven tools, chosen for longevity.
            </h2>
            <p class="mt-4 max-w-2xl text-lg text-primary-100">
              We pick boring, well-supported technology so your product is easy to hire for and cheap to maintain long after launch.
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

    <section class="py-16 lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title="Software that is already earning its keep."
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(study, index) in caseStudies.slice(0, 3)"
            :key="study.slug"
            :to="`/work#${study.slug}`"
            class="group flex flex-col border border-default bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''"
          >
            <div class="overflow-hidden">
              <img
                :src="photoUrl(study.photo, 800, 600)"
                :alt="study.photo.alt"
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

    <section class="border-y border-default bg-muted py-16 lg:py-24">
      <UContainer class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div class="flex flex-col gap-10 lg:col-span-5">
          <div>
            <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
              <span class="text-secondary-600">05</span>
              <span>Why us</span>
            </p>
            <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl lg:text-5xl">
              Commitments, written into every contract.
            </h2>
          </div>
          <dl class="grid grid-cols-2 gap-px border border-default bg-border">
            <div
              v-for="point in proofPoints"
              :key="point.label"
              class="flex flex-col bg-default p-5"
            >
              <dt class="text-sm text-muted">
                {{ point.label }}
              </dt>
              <dd class="order-first text-3xl font-bold tracking-tight text-highlighted">
                {{ point.value }}
              </dd>
            </div>
          </dl>
        </div>
        <ul class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-7">
          <li
            v-for="commitment in commitments"
            :key="commitment.title"
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

    <section class="py-16 lg:py-24">
      <UContainer class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <img
          :src="photoUrl(teamPhoto, 1200, 900)"
          :alt="teamPhoto.alt"
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
              <span>Team & culture</span>
            </p>
            <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl">
              Small, senior and in the room with you.
            </h2>
            <p class="mt-4 text-lg text-muted">
              Every project gets a compact squad drawn from four disciplines. You talk to the people building your product, in your Slack, every day.
            </p>
          </div>
          <ul class="grid grid-cols-1 gap-px border border-default bg-border sm:grid-cols-2">
            <li
              v-for="discipline in disciplines"
              :key="discipline.title"
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
      id="contact"
      class="border-t border-default bg-muted py-16 lg:py-24"
    >
      <UContainer class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
            <span class="text-secondary-600">07</span>
            <span>Contact</span>
          </p>
          <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl lg:text-5xl">
            Tell us what you are building.
          </h2>
          <p class="mt-4 text-lg text-muted">
            Share a few lines about your project. A senior engineer, not a salesperson, replies within one business day.
          </p>
        </div>
        <UCard class="lg:col-span-7">
          <ContactForm />
        </UCard>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  description: `${siteName} designs, builds and runs custom web platforms, mobile apps, cloud infrastructure and AI tooling on committed timelines.`
})
</script>
