<script setup>
import { reactive, ref } from 'vue'
import { locations } from '../../data/services'

const emit = defineEmits(['create-account', 'google-create-account', 'go-signin'])

const error = ref('')

const form = reactive({
  name: '',
  phone: '',
  password: '',
  location: '',
  email: ''
})

function submitForm() {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Name is required.'
    return
  }

  if (!form.phone.trim()) {
    error.value = 'Phone number is required.'
    return
  }

  if (!form.password.trim()) {
    error.value = 'Password is required.'
    return
  }

  if (!form.location) {
    error.value = 'Please select your Rajshahi location.'
    return
  }

  emit('create-account', {
    role: 'customer',
    name: form.name.trim(),
    phone: form.phone.trim(),
    password: form.password,
    location: form.location,
    email: form.email.trim(),
    accountMethod: 'phone'
  })
}

function continueWithGoogle() {
  if (!form.name.trim() || !form.phone.trim() || !form.location) {
    error.value = 'For this demo, enter your name, phone and location before continuing with Google.'
    return
  }

  emit('google-create-account', {
    role: 'customer',
    name: form.name.trim(),
    phone: form.phone.trim(),
    password: form.password || 'google-demo',
    location: form.location,
    email: form.email.trim(),
    accountMethod: 'google'
  })
}
</script>

<template>
  <section class="auth-page">
    <form class="auth-card clean-card" @submit.prevent="submitForm">
      <p class="eyebrow">Customer account</p>
      <h2>Create your account</h2>

      <p class="muted">
        Create a Rajshahi customer account. Name, phone number, password and location are required.
        Email is optional.
      </p>

      <label>
        Name *
        <input v-model="form.name" type="text" placeholder="Example: amy" />
      </label>

      <label>
        Phone number *
        <input v-model="form.phone" type="tel" placeholder="Example: 01XXXXXXXXX" />
      </label>

      <label>
        Password *
        <input v-model="form.password" type="password" placeholder="Create a password" />
      </label>

      <label>
        Location *
        <select v-model="form.location">
          <option value="">Select your area</option>
          <option v-for="area in locations" :key="area" :value="area">
            {{ area }}
          </option>
        </select>
      </label>

      <label>
        Email optional
        <input v-model="form.email" type="email" placeholder="Optional email address" />
      </label>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button class="primary" type="submit">Create account</button>

      <button class="secondary" type="button" @click="continueWithGoogle">
        Continue with Google
      </button>

      <button class="link-btn" type="button" @click="emit('go-signin')">
        Already have an account?
      </button>
    </form>
  </section>
</template>
