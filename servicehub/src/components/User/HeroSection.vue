<script setup>
// HeroSection.vue: landing page hero section with two clear calls to action.
defineEmits(['find-services', 'view-tracking'])
</script>

<template>
  <section class="hero-shell">
    <div class="hero-card clean-card">
      <div class="hero-copy">
        <p class="eyebrow">Rajshahi local service marketplace</p>
        <h1>Book trusted local help with live status tracking.</h1>
        <p class="hero-text">
          Customers can request services, providers manage jobs, and admins approve provider accounts before platform
          access.
        </p>
        <div class="hero-actions">
          <button class="primary" @click="$emit('find-services')">Find services</button>
          <button class="secondary" @click="$emit('view-tracking')">View tracking demo</button>
        </div>
      </div>

      <aside class="price-card">
        <span>Sprint feature</span>
        <strong>QR + tracking</strong>
        <p>Prototype sign-in, request management and DiDi-style progress tracking in one workflow.</p>
      </aside>
    </div>
  </section>
</template>
