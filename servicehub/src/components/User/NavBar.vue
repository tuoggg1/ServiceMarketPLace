<script setup>
defineProps({
  activePage: String,
  signedInUser: Object,
  theme: String
})

defineEmits(['navigate', 'sign-out', 'toggle-theme'])
</script>

<template>
  <header class="navbar app-navbar">
    <div class="nav-inner">
      <button class="brand-logo" type="button" @click="$emit('navigate', 'home')" aria-label="Go to ServiceHub home">
        <img src="/lightlogo.png" alt="ServiceHub logo" />
        <span>ServiceHub</span>
      </button>

      <nav class="nav-links" aria-label="Main navigation">
        <button :class="{ active: activePage === 'home' }" @click="$emit('navigate', 'home')">Home</button>
        <button :class="{ active: activePage === 'how' }" @click="$emit('navigate', 'how')">How it works</button>
        <button v-if="!signedInUser" :class="{ active: activePage === 'signin' }" @click="$emit('navigate', 'signin')">Sign in</button>
        <button v-if="!signedInUser" :class="{ active: activePage === 'provider-register' }" @click="$emit('navigate', 'provider-register')">Become a provider</button>
        <button v-if="signedInUser" :class="{ active: activePage === 'dashboard' }" @click="$emit('navigate', 'dashboard')">Dashboard</button>
      </nav>

      <div class="nav-actions">
        <button class="theme-toggle" type="button" @click="$emit('toggle-theme')">
          {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
        </button>
        <button v-if="signedInUser" class="account-pill" type="button" @click="$emit('navigate', 'dashboard')">
          <span>{{ signedInUser.role }}</span>{{ signedInUser.name }}
        </button>
        <button v-if="signedInUser" class="secondary small" type="button" @click="$emit('sign-out')">Log out</button>
      </div>
    </div>
  </header>
</template>
