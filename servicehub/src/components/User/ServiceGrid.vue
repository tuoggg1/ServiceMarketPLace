<script setup>
import ServiceCard from './ServiceCard.vue'
// Displays services from the current front-end catalogue. Later replace with backend data.
defineProps({ services: { type: Array, default: () => [] } })
defineEmits(['request'])
</script>

<template>
  <section class="page-section" id="services">
    <div class="section-heading">
      <p class="eyebrow">Service categories</p>
      <h2>Choose the work you need done</h2>
      <p>Images and categories are preserved. The request itself is saved through the API boundary so you can replace it
        with your database later.</p>
    </div>
    <div class="service-grid refined">
      <ServiceCard v-for="service in services" :key="service.id" :service="service"
        @request="$emit('request', $event)" />
    </div>
  </section>
</template>
