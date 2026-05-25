<script setup>
// Reusable card for each service category.
defineProps({ service: { type: Object, required: true } })
defineEmits(['request'])
</script>

<template>
  <article class="service-card clean-card">
    <img class="service-image" :src="service.image" :alt="service.title" />
    <div class="service-body">
      <span class="category-label">{{ service.category }}</span>
      <h3>{{ service.title }}</h3>
      <p>{{ service.description }}</p>
      <div class="card-footer-row">
        <strong>From ${{ service.startingPrice }}</strong>
        <button @click="$emit('request', service)">Request service</button>
      </div>
    </div>
  </article>
</template>
