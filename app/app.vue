<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} · ${siteName}` : `${siteName} · Software development studio`,
  link: [{ rel: 'icon', href: '/favicon.ico' }]
})
</script>
