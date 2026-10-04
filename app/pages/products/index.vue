<template>
  <UContainer class="flex flex-col gap-12 py-12 lg:py-20">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="This page could not be loaded"
      description="Please refresh in a moment."
    />

    <header
      v-if="sections?.hero"
      class="max-w-3xl"
    >
      <p
        v-if="sections.hero.eyebrow"
        class="font-mono text-sm uppercase tracking-widest text-secondary-600"
      >
        {{ sections.hero.eyebrow }}
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-tighter text-balance text-highlighted md:text-5xl">
        {{ sections.hero.title }}
      </h1>
      <p
        v-if="sections.hero.body"
        class="mt-4 text-lg text-muted"
      >
        {{ sections.hero.body }}
      </p>
    </header>

    <UEmpty
      v-if="!products.length"
      icon="i-lucide-package"
      title="No products published yet"
      variant="naked"
    />

    <ul
      v-else
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="product in products"
        :key="product.id"
      >
        <UCard class="h-full">
          <img
            v-if="product.imageUrl"
            :src="sizedImage(product.imageUrl, 800, 450)"
            :alt="product.imageAlt"
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
            class="aspect-video w-full object-cover"
          >
          <UBadge
            :label="product.tag"
            color="secondary"
            variant="subtle"
            class="mt-4"
          />
          <h2 class="mt-3 text-lg font-semibold text-highlighted">
            {{ product.title }}
          </h2>
          <p class="mt-2 text-sm text-muted">
            {{ product.description }}
          </p>
        </UCard>
      </li>
    </ul>

    <UButton
      label="Get started"
      to="/contact"
      size="lg"
      trailing-icon="i-lucide-arrow-right"
      class="self-start"
    />
  </UContainer>
</template>

<script setup lang="ts">
const { data, error } = await useFetch('/api/content/products')

const sections = computed(() => data.value?.sections)
const products = computed(() => data.value?.products ?? [])

usePageSeo({
  title: 'Products',
  seo: () => sections.value?.seo,
  fallback: () => sections.value?.hero
})
</script>
