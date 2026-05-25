<script setup>
// ServiceCategories.vue: optional category preview section for the landing page.
const categories = [
  { title: 'Errands', description: 'Bazaar shopping, medicine pickup and local parcel support.' },
  { title: 'Home repair', description: 'AC repair, electrical help and furniture assembly.' },
  { title: 'Cleaning', description: 'General cleaning, kitchen cleaning and home organisation.' }
]
</script>
<template>
  <section class="page-section">
    <div class="section-heading">
      <p class="eyebrow">Categories</p>
      <h2>Explore local help</h2>
    </div>
    <div class="step-grid">
      <article v-for="category in categories" :key="category.title" class="clean-card">
        <h3>{{ category.title }}</h3>
        <p>{{ category.description }}</p>
      </article>
    </div>
  </section>
</template>
