<template>
  <div>
    <MainHeader />

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ year }} {{ siteName }}. Software, designed and run with care.
        </p>
      </template>

      <UNavigationMenu
        :items="navigation"
        variant="link"
      />

      <template #right>
        <UButton
          label="Start a project"
          to="/contact"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-up-right"
        />
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
