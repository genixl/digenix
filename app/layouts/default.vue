<template>
  <div>
    <MainHeader />

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ year }} {{ siteName }}.
          <template v-if="data?.sections.footer">
            {{ data.sections.footer.body }}
          </template>
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

const { data } = await useFetch('/api/content/site')
</script>
