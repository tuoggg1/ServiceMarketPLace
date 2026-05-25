<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  accounts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['signin', 'go-register', 'go-provider-register', 'google-signin'])

const error = ref('')

const form = reactive({
  role: 'customer',
  identifier: '',
  password: ''
})

const identifierLabel = computed(() => {
  if (form.role === 'customer') return 'Name'
  if (form.role === 'provider') return 'Provider ID'
  return 'Admin ID'
})

const identifierPlaceholder = computed(() => {
  if (form.role === 'customer') return 'Enter your registered name'
  if (form.role === 'provider') return 'Enter your provider ID'
  return 'Enter admin ID'
})

const helperText = computed(() => {
  if (form.role === 'admin') return 'Demo admin login: admin01 / admin123'
  if (form.role === 'provider') return 'Provider must be approved by admin before sign in.'
  return 'Use the same name and password you used when creating your account.'
})

const availableCount = computed(() => {
  return props.accounts.filter(account => account.role === form.role).length
})

function submitForm() {
  error.value = ''

  if (!form.identifier.trim()) {
    error.value = `${identifierLabel.value} is required.`
    return
  }

  if (!form.password.trim()) {
    error.value = 'Password is required.'
    return
  }

  emit('signin', {
    role: form.role,
    identifier: form.identifier.trim(),
    password: form.password
  })
}

function googleSignIn() {
  emit('google-signin', {
    role: form.role,
    identifier: form.identifier.trim(),
    password: form.password || 'google-demo'
  })
}
</script>

<template>
  <section class="auth-page">
    <form class="auth-card clean-card" @submit.prevent="submitForm">
      <p class="eyebrow">Sign in</p>
      <h2>Access your dashboard</h2>

      <p class="muted">{{ helperText }}</p>

      <label>
        Role
        <select v-model="form.role">
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <label>
        {{ identifierLabel }}
        <input
          v-model="form.identifier"
          type="text"
          :placeholder="identifierPlaceholder"
        />
      </label>

      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          placeholder="Enter password"
        />
      </label>

      <small class="muted">
        Available {{ form.role }} accounts: {{ availableCount }}
      </small>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button class="primary" type="submit">Sign in</button>

      <button class="secondary" type="button" @click="googleSignIn">
        Continue with Google
      </button>

      <div class="auth-links">
        <button class="link-btn" type="button" @click="emit('go-register')">
          Create customer
        </button>

        <button class="link-btn" type="button" @click="emit('go-provider-register')">
          Register provider
        </button>
      </div>
    </form>
  </section>
</template>
