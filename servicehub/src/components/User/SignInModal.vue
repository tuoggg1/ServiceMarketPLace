<script setup>
// SignInModal.vue: optional modal version of the sign-in workflow.
import { ref } from 'vue'
const emit = defineEmits(['close', 'sign-in'])
const username = ref('')
const password = ref('')
function submit() { if (username.value && password.value) emit('sign-in', { username: username.value, password: password.value }) }
</script>
<template>
  <div class="modal-backdrop">
    <form class="modal-card" @submit.prevent="submit"><button type="button" class="icon-close"
        @click="$emit('close')">×</button>
      <p class="eyebrow">Secure sign in</p>
      <h2>Sign in to ServiceHub</h2><label>Username<input v-model.trim="username"></label><label>Password<input
          v-model="password" type="password"></label><button class="primary">Sign in</button>
    </form>
  </div>
</template>
