<script setup>
import { formatBDT } from '../../data/services'

defineProps({
  service: {
    type: Object,
    required: true
  }
})

defineEmits(['request'])
</script>

<template>
  <article class="service-card clean-card">
    <div class="service-photo-wrap">
      <img class="service-image" :src="`${service.image}?auto=format&fit=crop&w=900&q=80`" :alt="service.title" />
      <span class="verified-badge">Verified local</span>
    </div>

    <div class="service-body">
      <div class="service-topline">
        <span class="category-label">{{ service.category }}</span>
        <span>Rajshahi</span>
      </div>

      <h3>{{ service.title }}</h3>
      <p>{{ service.description }}</p>

      <div class="service-stats">
        <div><span>response</span><strong>15 min</strong></div>
        <div><span>rating</span><strong>4.8/5</strong></div>
        <div><span>area</span><strong>local</strong></div>
      </div>

      <div class="card-footer-row">
        <strong>From {{ formatBDT(service.price) }}</strong>
        <button class="service-request-btn" type="button" @click="$emit('request', service)">Request service</button>
      </div>
    </div>
  </article>
</template>
