<template>
  <header class="grid gap-4 lg:grid-cols-12 lg:gap-8">
    <p class="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted lg:col-span-3 lg:items-start lg:pt-3">
      <span class="text-secondary-600">{{ index }}</span>
      <span>{{ eyebrow }}</span>
    </p>
    <div class="lg:col-span-9">
      <h2 class="text-3xl font-bold tracking-tighter text-balance text-highlighted md:text-4xl lg:text-5xl">
        {{ title }}
      </h2>
      <p
        v-if="lead"
        class="mt-4 max-w-2xl text-lg text-pretty text-muted"
      >
        {{ lead }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  index: string
  eyebrow: string
  title: string
  lead?: string
}>()
</script>
