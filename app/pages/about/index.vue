<template>
  <div>
    <section class="border-b border-default">
      <UContainer class="py-16 lg:py-28">
        <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted">
          <span
            class="size-3 bg-secondary"
            aria-hidden="true"
          />
          About {{ siteName }}
        </p>
        <h1 class="mt-8 max-w-5xl text-4xl font-bold tracking-tighter text-balance text-highlighted md:text-6xl lg:text-7xl">
          We started {{ siteName }} because clients deserve software they <span class="text-primary">understand, own and can grow.</span>
        </h1>
      </UContainer>
    </section>

    <UContainer class="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-24">
      <h2 class="text-2xl font-bold tracking-tight text-highlighted md:col-span-2 lg:col-span-4">
        Our story
      </h2>
      <p class="text-lg text-muted lg:col-span-4">
        We spent years inside agencies and product teams watching the same pattern repeat: a polished pitch, a long silence, then a handover nobody could maintain. Budgets were spent before anyone saw working software.
      </p>
      <p class="text-lg text-muted lg:col-span-4">
        {{ siteName }} is the studio we wanted to hire. Senior people from kickoff to launch, a demo every two weeks, and every line of code, design file and cloud account in your name from the first day.
      </p>
    </UContainer>

    <img
      :src="photoUrl(studioPhoto, 1600, 700)"
      :alt="studioPhoto.alt"
      width="1600"
      height="700"
      loading="lazy"
      decoding="async"
      class="aspect-video w-full object-cover md:aspect-21/9"
    >

    <section class="py-16 lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="01"
          eyebrow="Principles"
          title="How we behave when nobody is watching."
        />
        <ol class="grid grid-cols-1 gap-px border border-default bg-border md:grid-cols-3">
          <li
            v-for="(principle, index) in principles"
            :key="principle.title"
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

    <section class="border-t border-default bg-muted py-16 lg:py-24">
      <UContainer class="flex flex-col gap-12">
        <SectionHeading
          index="02"
          eyebrow="The team"
          title="Four disciplines, one squad per project."
          lead="Squads are assembled for each engagement and stay together until launch, so context is never lost in a handover."
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <UCard
            v-for="discipline in disciplines"
            :key="discipline.title"
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

    <CtaBand
      title="Work with people who will still answer in a year."
      lead="We measure success by how many clients come back with their next project."
    />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: `Why ${siteName} exists, the principles we work by and the disciplines on every project team.`
})
</script>
