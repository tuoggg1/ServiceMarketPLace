<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['sign-in', 'go-register'])

const form = reactive({
  role: 'customer',
  email: '',
  password: ''
})

function submitLogin() {
  emit('sign-in', form)
}
</script>

<template>
  <section class="auth-page">
    <form class="auth-card clean-card" @submit.prevent="submitLogin">
      <p class="eyebrow">Sign in</p>
      <h2>Access your dashboard</h2>
      <p class="muted">Choose customer, provider, or admin to view the correct dashboard.</p>

      <label>
        Account type
        <select v-model="form.role">
          <option value="customer">Customer dashboard</option>
          <option value="provider">Provider dashboard</option>
          <option value="admin">Admin dashboard</option>
        </select>
      </label>

      <label>Email / phone <input v-model="form.email" placeholder="demo@servicehub.local" /></label>
      <label>Password <input v-model="form.password" type="password" placeholder="Any demo password" /></label>

      <button class="primary" type="submit">Sign in</button>
      <button class="secondary" type="button" @click="emit('go-register')">Create customer account</button>
    </form>
  </section>
</template>
