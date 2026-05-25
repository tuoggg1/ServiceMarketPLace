<script setup>
import { reactive } from 'vue'

// Provider registration is submitted to admin for approval before provider sign-in becomes active.
defineEmits(['created', 'google-create', 'go'])
const form = reactive({ name: '', email: '', password: '', phone: '', suburb: '', serviceType: 'cleaning', experience: '' })
</script>

<template>
  <section class="auth-page">
    <form class="auth-card clean-card"
      @submit.prevent="$emit('created', { ...form, role: 'provider', authProvider: 'email' })">
      <p class="eyebrow">Provider registration</p>
      <h2>Apply to become a provider</h2>
      <p class="muted">Provider accounts are pending until admin approves them.</p>
      <label>Name <input v-model="form.name" required /></label>
      <label>Email <input v-model="form.email" type="email" required /></label>
      <label>Password <input v-model="form.password" type="password" required /></label>
      <label>Phone <input v-model="form.phone" /></label>
      <label>Suburb <input v-model="form.suburb" /></label>
      <label>Service type
        <select v-model="form.serviceType">
          <option value="cleaning">Home Cleaning</option>
          <option value="assembly">Furniture Assembly</option>
          <option value="moving">Moving Help</option>
          <option value="gardening">Garden Maintenance</option>
          <option value="tech">Tech Support</option>
          <option value="delivery">Delivery Service</option>
        </select>
      </label>
      <label>Experience <textarea v-model="form.experience"
          placeholder="Briefly explain your skills"></textarea></label>
      <button class="primary" type="submit">Submit provider application</button>
      <button class="secondary" type="button" @click="$emit('google-create', 'provider')">Apply with Google</button>
      <button class="link-btn" type="button" @click="$emit('go', 'signin')">Back to sign in</button>
    </form>
  </section>
</template>
