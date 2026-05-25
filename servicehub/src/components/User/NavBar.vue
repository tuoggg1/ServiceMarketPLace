<script setup>
defineProps({
  activePage: String,
  signedInUser: Object,
  theme: String
})

defineEmits(['navigate', 'sign-out', 'toggle-theme'])
</script>

<template>
  <header class="navbar">
    <div class="nav-inner">
      <button class="brand-text" @click="$emit('navigate', 'home')">
        ServiceHub
      </button>

      <nav class="nav-links" aria-label="Main navigation">
        <button :class="{ active: activePage === 'home' }" @click="$emit('navigate', 'home')">
          Home
        </button>

        <button :class="{ active: activePage === 'how' }" @click="$emit('navigate', 'how')">
          How it works
        </button>

        <button v-if="!signedInUser" :class="{ active: activePage === 'signin' }" @click="$emit('navigate', 'signin')">
          Sign in
        </button>

        <button
          v-if="!signedInUser"
          :class="{ active: activePage === 'provider-register' }"
          @click="$emit('navigate', 'provider-register')"
        >
          Become a provider
        </button>

        <button v-if="signedInUser" :class="{ active: activePage === 'dashboard' }" @click="$emit('navigate', 'dashboard')">
          Dashboard
        </button>
      </nav>

      <div class="nav-actions">
        <button class="theme-toggle" @click="$emit('toggle-theme')">
          {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
        </button>

        <button v-if="signedInUser" class="account-pill" @click="$emit('navigate', 'dashboard')">
          <span>{{ signedInUser.role }}</span>
          {{ signedInUser.name }}
        </button>

        <button v-if="signedInUser" class="secondary small" @click="$emit('sign-out')">
          Log out
        </button>
      </div>
    </div>
  </header>
</template>
