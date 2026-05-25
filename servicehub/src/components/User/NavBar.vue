<script setup>
// Main navigation for public, customer, provider, and admin screens.
defineProps({ activePage: String, currentUser: Object, theme: String })
defineEmits(['go', 'logout', 'toggle-theme'])
</script>

<template>
  <header class="navbar">
    <div class="nav-inner">
      <button class="brand-text" @click="$emit('go', 'home')">ServiceHub</button>

      <nav class="nav-links" aria-label="Main navigation">
        <button :class="{ active: activePage === 'home' }" @click="$emit('go', 'home')">Home</button>
        <button :class="{ active: activePage === 'how' }" @click="$emit('go', 'how')">How it works</button>
        <button :class="{ active: activePage === 'signin' }" @click="$emit('go', 'signin')">Sign in</button>
        <button :class="{ active: activePage === 'provider-register' }" @click="$emit('go', 'provider-register')">Become
          a provider</button>
      </nav>

      <div class="nav-actions">
        <button class="theme-toggle" @click="$emit('toggle-theme')">
          {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
        </button>
        <button v-if="currentUser" class="account-pill"
          @click="$emit('go', currentUser.role === 'admin' ? 'admin' : currentUser.role === 'provider' ? 'provider' : 'customer')">
          <span>{{ currentUser.role }}</span>{{ currentUser.name }}
        </button>
        <button v-if="currentUser" class="secondary small" @click="$emit('logout')">Log out</button>
      </div>
    </div>
  </header>
</template>
