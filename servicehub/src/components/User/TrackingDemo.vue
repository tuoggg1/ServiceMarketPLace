<script setup>
// TrackingDemo.vue: DiDi-style status prototype for showing service progress to the user.
import { ref } from 'vue'

defineProps({ booking: { type: Object, required: true } })
defineEmits(['back'])
const activeStep = ref(0)
const steps = ['Request accepted', 'Provider travelling', 'Provider nearby', 'Provider arrived', 'Service completed']
function nextStep() { if (activeStep.value < steps.length - 1) activeStep.value++ }
</script>

<template>
  <section class="page-section tracking-page">
    <button class="back-pill" @click="$emit('back')">← Back</button>
    <div class="tracking-layout clean-card">
      <div>
        <p class="eyebrow">Live tracking demo</p>
        <h2>{{ booking.serviceTitle }}</h2>
        <p class="muted">{{ booking.area }} · {{ booking.date }} {{ booking.time }}</p>
        <div class="tracking-steps">
          <article v-for="(item, index) in steps" :key="item" :class="{ active: index <= activeStep }"><span>{{ index +
              1 }}</span>
            <p>{{ item }}</p>
          </article>
        </div>
        <button class="primary" @click="nextStep">Move to next step</button>
      </div>
      <div class="tracking-map">
        <div class="map-pin provider">Provider</div>
        <div class="map-line"></div>
        <div class="map-pin home">Home</div>
      </div>
    </div>
  </section>
</template>
