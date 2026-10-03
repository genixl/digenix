<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="meta.label">
        <template #right>
          <UButton
            v-if="canCreate"
            label="New"
            icon="i-lucide-plus"
            @click="openCreate"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="Records could not be loaded"
        :description="error.statusMessage"
      />

      <UTable
        :data="data ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        :empty="`No ${meta.label.toLowerCase()} yet`"
      >
        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="View record"
              @click="viewing = row.original"
            />
            <UButton
              v-if="canEdit"
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Edit record"
              @click="openEdit(row.original)"
            />
            <UButton
              v-if="isEditor"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              aria-label="Delete record"
              @click="deletingId = recordId(row.original)"
            />
          </div>
        </template>
      </UTable>

      <UModal
        :open="viewing !== undefined"
        :title="meta.label"
        @update:open="viewing = undefined"
      >
        <template #body>
          <dl
            v-if="viewing"
            class="flex flex-col gap-4"
          >
            <div
              v-for="(value, key) in viewing"
              :key="key"
            >
              <dt class="font-mono text-xs uppercase tracking-widest text-muted">
                {{ key }}
              </dt>
              <dd class="mt-1 whitespace-pre-line break-words text-default">
                {{ display(value, String(key), false) }}
              </dd>
            </div>
          </dl>
        </template>
      </UModal>

      <UModal
        :open="deletingId !== undefined"
        title="Delete this record?"
        description="This cannot be undone. Any attached image is removed from storage."
        @update:open="deletingId = undefined"
      >
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="deletingId = undefined"
            />
            <UButton
              label="Delete"
              color="error"
              icon="i-lucide-trash-2"
              :loading="removal.status.value === 'pending'"
              @click="confirmDelete"
            />
          </div>
        </template>
      </UModal>

      <USlideover
        v-model:open="formOpen"
        :title="editingId === undefined ? `New ${meta.label.toLowerCase()}` : `Edit ${meta.label.toLowerCase()}`"
      >
        <template #body>
          <UForm
            :schema="formSchema"
            :state="state"
            class="flex flex-col gap-5"
            @submit="onSave"
          >
            <UFormField
              v-for="field in meta.fields"
              :key="field.name"
              :name="field.name"
              :label="field.label"
              :help="field.help"
            >
              <UInput
                v-if="field.type === 'text' || field.type === 'password'"
                :model-value="asString(state[field.name])"
                :type="field.type === 'password' ? 'password' : 'text'"
                :autocomplete="field.type === 'password' ? 'new-password' : 'off'"
                class="w-full"
                @update:model-value="state[field.name] = $event"
              />
              <UTextarea
                v-else-if="field.type === 'textarea'"
                :model-value="asString(state[field.name])"
                :rows="4"
                autoresize
                class="w-full"
                @update:model-value="state[field.name] = $event"
              />
              <UInputNumber
                v-else-if="field.type === 'number'"
                :model-value="asNumber(state[field.name])"
                class="w-full"
                @update:model-value="state[field.name] = $event"
              />
              <USwitch
                v-else-if="field.type === 'boolean'"
                :model-value="state[field.name] === true"
                @update:model-value="state[field.name] = $event"
              />
              <USelect
                v-else-if="field.type === 'select'"
                :model-value="asString(state[field.name])"
                :items="[...field.options ?? []]"
                class="w-full"
                @update:model-value="state[field.name] = $event"
              />
              <UInputTags
                v-else-if="field.type === 'tags'"
                :model-value="asStrings(state[field.name])"
                placeholder="Type and press Enter"
                class="w-full"
                @update:model-value="state[field.name] = $event"
              />
              <AdminImageField
                v-else-if="field.type === 'image'"
                :url="asString(state.imageUrl) || null"
                @change="setImage"
              />
              <div
                v-else-if="field.type === 'results'"
                class="flex flex-col gap-3"
              >
                <div
                  v-for="(result, index) in results"
                  :key="index"
                  class="grid grid-cols-1 gap-2 sm:grid-cols-12"
                >
                  <UFormField
                    :name="`results.${index}.value`"
                    class="sm:col-span-4"
                  >
                    <UInput
                      v-model="result.value"
                      placeholder="38%"
                      aria-label="Result value"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    :name="`results.${index}.label`"
                    class="sm:col-span-7"
                  >
                    <UInput
                      v-model="result.label"
                      placeholder="fewer empty return trips"
                      aria-label="Result label"
                      class="w-full"
                    />
                  </UFormField>
                  <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    aria-label="Remove result"
                    class="sm:col-span-1"
                    @click="results.splice(index, 1)"
                  />
                </div>
                <UButton
                  label="Add result"
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  class="self-start"
                  @click="results.push({ value: '', label: '' })"
                />
              </div>
            </UFormField>

            <UAlert
              v-if="saving.status.value === 'error'"
              color="error"
              variant="subtle"
              icon="i-lucide-circle-alert"
              :title="saving.error.value?.statusMessage ?? 'Save failed'"
            />

            <UButton
              type="submit"
              label="Save"
              icon="i-lucide-save"
              size="lg"
              :loading="saving.status.value === 'pending'"
            />
          </UForm>
        </template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
import type { InternalApi } from 'nitropack/types'
import { adminResourceNames, type AdminResourceName } from '#shared/schemas/content'

type Row = Record<string, unknown>
type Result = { value: string, label: string }

// No page transition: UDashboardPanel has multiple root nodes. Keying by path remounts the page per resource.
definePageMeta({ layout: 'admin', middleware: 'admin', pageTransition: false, key: route => route.fullPath })

const route = useRoute()
const toast = useToast()

function isAdminResource(value: string): value is AdminResourceName {
  return adminResourceNames.some(name => name === value)
}

const resourceParam = String(route.params.resource)
if (!isAdminResource(resourceParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const resource: AdminResourceName = resourceParam
const meta = adminResourceMeta[resource]

useSeoMeta({ title: meta.label })

const { data: session } = useNuxtData<InternalApi['/api/auth/session']['get']>('admin-session')
const isEditor = computed(() => session.value?.user?.role === 'admin_editor')
const canCreate = computed(() => isEditor.value && meta.createSchema !== undefined)
const canEdit = computed(() => isEditor.value && meta.updateSchema !== undefined)

const { data, status, error, refresh } = await useFetch<Row[]>(`/api/admin/${resource}`, { key: `admin-${resource}` })

const columns: TableColumn<Row>[] = [
  ...meta.columns.map(column => ({
    accessorKey: column.key,
    header: column.label,
    cell: ({ row }: { row: { original: Row } }) => display(row.original[column.key], column.key, true)
  })),
  { id: 'actions', header: '' }
]

function display(value: unknown, key: string, short: boolean): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (key.endsWith('At') && typeof value === 'string') return value.slice(0, 16).replace('T', ' ')
  if (Array.isArray(value)) {
    return value.map(item => (typeof item === 'object' && item !== null ? Object.values(item).join(' ') : String(item))).join(', ')
  }
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return short && text.length > 80 ? `${text.slice(0, 80)}…` : text
}

function recordId(row: Row): number | undefined {
  return typeof row.id === 'number' ? row.id : undefined
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '')
const asNumber = (value: unknown): number => (typeof value === 'number' ? value : 0)
const asStrings = (value: unknown): string[] => (Array.isArray(value) ? value.filter(item => typeof item === 'string') : [])

function isResultList(value: unknown): value is Result[] {
  return Array.isArray(value) && value.every(item => typeof item?.value === 'string' && typeof item?.label === 'string')
}

const formOpen = ref(false)
const editingId = ref<number>()
const deletingId = ref<number>()
const viewing = ref<Row>()
const state = ref<Row>({})
const payload = ref<Row>()

const formSchema = computed(() => (editingId.value === undefined ? meta.createSchema : meta.updateSchema))
const results = computed<Result[]>(() => (isResultList(state.value.results) ? state.value.results : []))

function openCreate(): void {
  editingId.value = undefined
  state.value = emptyRecord(meta.fields)
  formOpen.value = true
}

function openEdit(row: Row): void {
  const record = emptyRecord(meta.fields)
  for (const key of Object.keys(record)) {
    const value = row[key]
    if (value === undefined) continue
    record[key] = Array.isArray(value) ? value.map(item => (typeof item === 'object' ? { ...item } : item)) : value
  }
  if (isResultList(record.results)) record.results = record.results.map(({ value, label }) => ({ value, label }))
  editingId.value = recordId(row)
  state.value = record
  formOpen.value = true
}

function setImage(image: { url: string, publicId: string } | null): void {
  state.value.imageUrl = image?.url ?? null
  state.value.imagePublicId = image?.publicId ?? null
}

const saving = useFetch(
  () => (editingId.value === undefined ? `/api/admin/${resource}` : `/api/admin/${resource}/${editingId.value}`),
  {
    key: `admin-save-${resource}`,
    method: computed(() => (editingId.value === undefined ? 'POST' : 'PUT')),
    body: payload,
    immediate: false,
    watch: false
  }
)

async function onSave(event: FormSubmitEvent<unknown>): Promise<void> {
  if (typeof event.data !== 'object' || event.data === null) return
  payload.value = { ...event.data }
  await saving.execute()
  if (saving.status.value !== 'success') return
  formOpen.value = false
  toast.add({ title: 'Saved', color: 'success', icon: 'i-lucide-check' })
  await refresh()
}

const removal = useFetch(() => `/api/admin/${resource}/${deletingId.value}`, {
  key: `admin-delete-${resource}`,
  method: 'DELETE',
  immediate: false,
  watch: false
})

async function confirmDelete(): Promise<void> {
  await removal.execute()
  if (removal.status.value === 'success') {
    toast.add({ title: 'Deleted', color: 'success', icon: 'i-lucide-check' })
    await refresh()
  } else {
    toast.add({ title: removal.error.value?.statusMessage ?? 'Delete failed', color: 'error', icon: 'i-lucide-circle-alert' })
  }
  deletingId.value = undefined
}
</script>
