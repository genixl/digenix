<template>
  <div class="flex flex-col gap-3">
    <div
      v-if="url"
      class="flex items-start gap-3"
    >
      <img
        :src="sizedImage(url, 320, 240)"
        alt="Current image"
        width="160"
        height="120"
        class="aspect-4/3 w-40 border border-default object-cover"
      >
      <UButton
        label="Remove"
        icon="i-lucide-trash-2"
        color="neutral"
        variant="outline"
        size="sm"
        @click="emit('change', null)"
      />
    </div>

    <UFileUpload
      v-model="file"
      accept="image/jpeg,image/png,image/webp,image/avif"
      :label="url ? 'Replace image' : 'Upload image'"
      description="JPEG, PNG, WebP or AVIF, up to 5 MB"
      icon="i-lucide-image-up"
      :disabled="status === 'pending'"
      class="w-full"
    />

    <UAlert
      v-if="status === 'error'"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="error?.statusMessage ?? 'Upload failed'"
    />
  </div>
</template>

<script setup lang="ts">
import type { InternalApi } from 'nitropack/types'

type StoredImage = InternalApi['/api/admin/uploads']['post']

defineProps<{
  url: string | null
}>()

const emit = defineEmits<{
  change: [image: StoredImage | null]
}>()

const file = ref<File | null>(null)
const body = ref<FormData>()

const { data, status, error, execute } = useFetch('/api/admin/uploads', {
  method: 'POST',
  body,
  immediate: false,
  watch: false
})

watch(file, async (selected) => {
  if (!selected) return
  const form = new FormData()
  form.append('file', selected)
  body.value = form
  await execute()
  if (status.value === 'success' && data.value) emit('change', data.value)
  file.value = null
})
</script>
