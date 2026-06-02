<script setup>
// ServiceFlow.vue: optional two-step service/task selector kept for future expansion.
defineProps({ services: { type: Array, required: true }, selectedService: { type: Object, default: null }, mode: { type: String, default: 'services' } })
defineEmits(['select-service', 'select-task', 'back'])
</script>
<template>
  <section v-if="mode === 'services'" class="page-section">
    <div class="service-grid refined">
      <article v-for="service in services" :key="service.id" class="service-card clean-card"
        @click="$emit('select-service', service)"><img :src="service.image" :alt="service.title" class="service-image">
        <div class="service-body"><span class="category-label">{{ service.category }}</span>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </div>
      </article>
    </div>
  </section>
  <section v-else class="page-section"><button class="back-pill" @click="$emit('back')">Back</button>
    <div class="task-layout clean-card">
      <div class="task-panel">
        <h2>{{ selectedService?.title }}</h2><button v-for="task in selectedService?.tasks" :key="task"
          class="task-option" @click="$emit('select-task', task)">{{ task }}<span class="task-arrow">→</span></button>
      </div><img :src="selectedService?.image" :alt="selectedService?.title" class="detail-image">
    </div>
  </section>
</template>
