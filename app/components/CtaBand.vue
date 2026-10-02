<template>
  <section class="bg-primary-900 text-inverted">
    <UContainer class="flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between lg:py-20">
      <div class="max-w-2xl">
        <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-secondary-300">
          <span
            class="size-2 bg-secondary"
            aria-hidden="true"
          />
          Next step
        </p>
        <h2 class="mt-4 text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl">
          {{ title }}
        </h2>
        <p class="mt-4 text-lg text-primary-100">
          {{ lead }}
        </p>
      </div>
      <UButton
        label="Start a project"
        to="/contact"
        color="neutral"
        variant="outline"
        size="xl"
        trailing-icon="i-lucide-arrow-right"
        class="self-start md:self-auto"
      />
    </UContainer>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  lead: string
}>()
</script>
