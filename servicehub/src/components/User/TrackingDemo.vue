<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  requests: {
    type: Array,
    default: () => []
  },
  signedInUser: Object
})

defineEmits(['back'])

const activeStep = ref(1)

const booking = computed(() => {
  return props.requests[0] || {
    serviceTitle: 'Home Cleaning',
    customerLocation: 'Boalia, Rajshahi',
    preferredDate: 'Demo booking',
    status: 'assigned'
  }
})

const steps = [
  'Request submitted',
  'Admin reviewing',
  'Provider assigned',
  'Provider travelling',
  'Service completed'
]

function nextStep() {
  if (activeStep.value < steps.length - 1) activeStep.value++
}
</script>

<template>
  <section class="page-section tracking-page">
    <button class="back-pill" @click="$emit('back')">Back</button>

    <div class="tracking-layout clean-card">
      <div>
        <p class="eyebrow">Live tracking demo</p>
        <h2>{{ booking.serviceTitle }}</h2>
        <p class="muted">
          {{ booking.customerLocation || booking.location || 'Rajshahi' }} ·
          {{ booking.preferredDate || booking.date || 'Demo date' }}
        </p>

        <div class="tracking-steps">
          <article v-for="(item, index) in steps" :key="item" :class="{ active: index <= activeStep }">
            <span>{{ index + 1 }}</span>
            <p>{{ item }}</p>
          </article>
        </div>

        <button class="primary" @click="nextStep">Move to next step</button>
      </div>

      <div class="tracking-map">
        <div class="map-pin provider">Provider</div>
        <div class="map-line"></div>
        <div class="map-pin home">Customer</div>
      </div>
    </div>
  </section>
</template>
