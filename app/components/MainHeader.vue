<template>
  <UHeader mode="slideover">
    <template #title>
      <AppLogo />
    </template>

    <UNavigationMenu
      :items="navigation"
      variant="link"
    />

    <template #right>
      <UButton
        label="Start a project"
        to="/contact"
        trailing-icon="i-lucide-arrow-up-right"
        class="hidden sm:inline-flex"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="navigation"
        orientation="vertical"
      />
      <UButton
        label="Start a project"
        to="/contact"
        trailing-icon="i-lucide-arrow-up-right"
        size="lg"
        block
        class="mt-6"
      />
    </template>
  </UHeader>
</template>
