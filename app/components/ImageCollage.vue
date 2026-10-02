<template>
  <figure class="flex flex-col gap-3">
    <div class="relative">
      <div
        class="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2"
        aria-hidden="true"
      >
        <div
          v-for="cell in CELL_CLASSES"
          :key="cell"
          class="border border-dashed border-accented"
        />
      </div>

      <TransitionGroup
        tag="ul"
        class="relative grid aspect-4/3 grid-cols-4 grid-rows-3 gap-2"
        enter-active-class="transition duration-700 ease-out motion-reduce:transition-none"
        enter-from-class="scale-75 opacity-0"
        leave-active-class="transition duration-500 ease-in motion-reduce:transition-none"
        leave-to-class="scale-110 opacity-0"
      >
        <li
          v-for="tile in tiles"
          :key="tile.id"
          class="overflow-hidden"
          :class="CELL_CLASSES[tile.cell]"
        >
          <img
            v-if="tile.visual.kind === 'photo'"
            :src="photoUrl(tile.visual.photo, 400, 400)"
            :alt="tile.visual.photo.alt"
            width="400"
            height="400"
            decoding="async"
            class="size-full object-cover"
          >
          <div
            v-else
            class="flex size-full flex-col justify-between p-2 text-inverted sm:p-3"
            :class="tile.visual.tone === 'primary' ? 'bg-primary' : 'bg-secondary-700'"
          >
            <UIcon
              :name="tile.visual.icon"
              class="size-5 sm:size-7"
            />
            <span class="text-xs font-semibold leading-tight sm:text-sm">{{ tile.visual.label }}</span>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <figcaption class="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted">
      <span>From the studio floor</span>
      <UButton
        :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'"
        :aria-label="playing ? 'Pause image rotation' : 'Play image rotation'"
        color="neutral"
        variant="outline"
        size="xs"
        @click="playing ? stop() : start()"
      />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
interface Tile {
  id: number
  cell: number
  visual: HeroVisual
}

// Literal class strings so Tailwind can see every grid placement.
const CELL_CLASSES = [
  'col-start-1 row-start-1', 'col-start-2 row-start-1', 'col-start-3 row-start-1', 'col-start-4 row-start-1',
  'col-start-1 row-start-2', 'col-start-2 row-start-2', 'col-start-3 row-start-2', 'col-start-4 row-start-2',
  'col-start-1 row-start-3', 'col-start-2 row-start-3', 'col-start-3 row-start-3', 'col-start-4 row-start-3'
] as const

// Deterministic first frame keeps server and client markup identical.
const INITIAL_CELLS = [0, 2, 5, 7, 8, 11]
const INTERVAL_MS = 1800

const tiles = ref<Tile[]>(
  INITIAL_CELLS.flatMap((cell, index) => {
    const visual = heroVisuals[index]
    return visual ? [{ id: index, cell, visual }] : []
  })
)
const playing = ref(false)

let nextId = tiles.value.length
let nextVisual = tiles.value.length
let timer: ReturnType<typeof setInterval> | undefined

function pick<T>(items: readonly T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)]
}

function takeNextVisual(): HeroVisual | undefined {
  const shown = new Set(tiles.value.map(tile => tile.visual))
  for (let step = 0; step < heroVisuals.length; step++) {
    const candidate = heroVisuals[(nextVisual + step) % heroVisuals.length]
    if (candidate && !shown.has(candidate)) {
      nextVisual = (nextVisual + step + 1) % heroVisuals.length
      return candidate
    }
  }
  return undefined
}

function cycle(): void {
  const leaving = pick(tiles.value)
  const occupied = new Set(tiles.value.map(tile => tile.cell))
  const cell = pick(CELL_CLASSES.map((_, index) => index).filter(index => !occupied.has(index)))
  const visual = takeNextVisual()
  if (!leaving || cell === undefined || !visual) return

  tiles.value = [
    ...tiles.value.filter(tile => tile.id !== leaving.id),
    { id: nextId++, cell, visual }
  ]
}

function start(): void {
  stop()
  timer = setInterval(cycle, INTERVAL_MS)
  playing.value = true
}

function stop(): void {
  clearInterval(timer)
  timer = undefined
  playing.value = false
}

onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start()
})

onBeforeUnmount(stop)
</script>
