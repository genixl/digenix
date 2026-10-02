<template>
  <UContainer class="mx-auto max-w-[960px] px-4 py-8 sm:px-6 lg:px-8">
    <section class="mx-auto max-w-[760px]">
      <div class="mb-6 text-center md:text-left">
        <h2 class="text-[2.1rem] font-semibold tracking-[-0.06em] text-slate-900 sm:text-[2.5rem] lg:text-[2.8rem]">
          What We Offer
        </h2>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <UCard
          v-for="item in offerings"
          :key="item.title"
          class="overflow-hidden rounded-[22px] border border-[#dfe6ec] bg-[#f3f6f8] shadow-none"
        >
          <template #header>
            <div class="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
              <div class="space-y-2">
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {{ item.tag }}
                </p>
                <h3 class="text-[1.05rem] font-semibold leading-tight text-slate-900">
                  {{ item.title }}
                </h3>
              </div>

              <div class="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-[#dfeff6] shadow-inner shadow-slate-200/80">
                <img
                  :src="productImage"
                  alt=""
                  class="h-full w-full object-cover"
                >
              </div>
            </div>
          </template>

          <div class="px-4 pb-4">
            <div class="mb-4 overflow-hidden rounded-[18px] border border-white/60 bg-[#dfeef6]">
              <img
                :src="productImage"
                alt=""
                class="h-[150px] w-full object-cover object-center"
              >
            </div>

            <p class="text-[0.84rem] leading-6 text-slate-600">
              {{ item.description }}
            </p>
          </div>
        </UCard>
      </div>

      <div class="mt-7 flex justify-center">
        <UButton
          label="Get Started"
          class="rounded-xl bg-[#0d1d4d] px-8 py-3 text-base font-semibold text-white shadow-none hover:bg-[#132861]"
        />
      </div>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const productImage = new URL('../../assets/images/SW4.jpg', import.meta.url).href

const offerings = [
  {
    tag: 'App',
    title: 'App Development',
    description: 'This is the app development service we offer to help your business work smarter and grow faster.'
  },
  {
    tag: 'Web',
    title: 'Web app development',
    description: 'Our web app development solutions are built to deliver speed, usability, and long-term value.'
  },
  {
    tag: 'Custom',
    title: 'Custom Services',
    description: 'We build custom services that support your goals, workflows, and business operations with precision.'
  },
  {
    tag: 'Enterprise',
    title: 'Enterprise Solutions',
    description: 'These enterprise-ready solutions are designed for larger teams, systems, and business-scale growth.'
  }
]
</script>
