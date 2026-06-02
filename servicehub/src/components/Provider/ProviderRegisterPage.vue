<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['created', 'google-create', 'go'])

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  suburb: '',
  serviceType: 'AC Repair & Home Maintenance',
  experience: ''
})
</script>

<template>
  <section class="auth-page provider-register-page split-auth-page">
    <form
      class="auth-card clean-card"
      @submit.prevent="$emit('created', { ...form, role: 'provider', authProvider: 'email' })"
    >
      <p class="eyebrow">Provider registration</p>
      <h2>Apply to become a provider</h2>
      <p class="muted">
        Provider accounts stay pending until admin approves them.
      </p>

      <label>Name *<input v-model="form.name" required placeholder="Example: Rajshahi AC Team" /></label>
      <label>Email *<input v-model="form.email" type="email" required placeholder="provider@email.com" /></label>
      <label>Password *<input v-model="form.password" type="password" required placeholder="Create a password" /></label>
      <label>Phone *<input v-model="form.phone" required placeholder="01XXXXXXXXX" /></label>
      <label>Service area<input v-model="form.suburb" placeholder="Example: Boalia" /></label>

      <label>
        Service type
        <select v-model="form.serviceType">
          <option>AC Repair & Home Maintenance</option>
          <option>Home Cleaning</option>
          <option>Moving Help</option>
          <option>Delivery Service</option>
          <option>Technology Support</option>
          <option>Tutoring</option>
        </select>
      </label>

      <label>
        Experience
        <textarea
          v-model="form.experience"
          placeholder="Briefly explain your skills, tools, availability and service experience"
        ></textarea>
      </label>

      <button class="primary" type="submit">Submit provider application</button>
      <button
        class="secondary"
        type="button"
        @click="$emit('google-create', { ...form, name: form.name || 'Google Provider', role: 'provider', authProvider: 'google' })"
      >
        Apply with Google demo
      </button>
      <button class="link-btn" type="button" @click="emit('go', 'signin')">
        Back to sign in
      </button>
    </form>

    <aside class="provider-showcase-panel clean-card">
      <div class="provider-photo-grid">
        <article>
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" alt="Cleaning provider" />
          <span>Cleaning</span>
        </article>
        <article>
          <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80" alt="Repair provider" />
          <span>Repair</span>
        </article>
        <article>
          <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=700&q=80" alt="Delivery provider" />
          <span>Delivery</span>
        </article>
        <article>
          <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80" alt="Tutoring provider" />
          <span>Tutoring</span>
        </article>
      </div>

      <div>
        <p class="eyebrow">Provider workflow</p>
        <h2>Grow your local service business</h2>
        <div class="provider-benefits">
          <span>✓ Receive bookings</span>
          <span>✓ Manage assigned jobs</span>
          <span>✓ Request chat approval</span>
          <span>✓ Build trusted reviews</span>
        </div>
      </div>
    </aside>
  </section>
</template>
