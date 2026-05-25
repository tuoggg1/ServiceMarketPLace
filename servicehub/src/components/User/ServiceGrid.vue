<script setup>
import ServiceCard from './ServiceCard.vue'

defineProps({
  services: {
    type: Array,
    default: () => []
  }
})

defineEmits(['request-service'])
</script>

<template>
  <section class="page-section" id="services">
    <div class="section-heading">
      <p class="eyebrow">Rajshahi service categories</p>
      <h2>Choose trusted local help</h2>
      <p>
        Browse household, repair, delivery, care and support services for Rajshahi customers.
      </p>
    </div>

    <div class="service-grid refined">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
        @request="$emit('request-service', $event)"
      />
    </div>
  </section>
</template>
