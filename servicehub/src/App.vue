<script setup>
import { ref, computed, watch } from 'vue'
import { services } from './data/services'

import NavBar from './components/User/NavBar.vue'
import HeroSection from './components/User/HeroSection.vue'
import ServiceGrid from './components/User/ServiceGrid.vue'
import HowItWorksPage from './components/User/HowItWorksPage.vue'
import SignInPage from './components/User/SignInPage.vue'
import RegisterPage from './components/User/RegisterPage.vue'
import ProviderRegisterPage from './components/Provider/ProviderRegisterPage.vue'
import RequestForm from './components/User/RequestForm.vue'
import CustomerDashboard from './components/User/CustomerDashboard.vue'
import ProviderDashboard from './components/Provider/ProviderDashboard.vue'
import AdminDashboard from './components/Admin/AdminDashboard.vue'
import TrackingDemo from './components/User/TrackingDemo.vue'
import FooterSection from './components/User/FooterSection.vue'

const savedRequests = JSON.parse(localStorage.getItem('servicehub-requests') || '[]')
const savedUser = JSON.parse(localStorage.getItem('servicehub-user') || 'null')

const currentPage = ref('home')
const theme = ref(localStorage.getItem('servicehub-theme') || 'light')
const signedInUser = ref(savedUser)
const selectedService = ref(null)
const requests = ref(savedRequests)

document.documentElement.dataset.theme = theme.value

watch(theme, value => {
  document.documentElement.dataset.theme = value
  localStorage.setItem('servicehub-theme', value)
})

watch(requests, value => {
  localStorage.setItem('servicehub-requests', JSON.stringify(value))
}, { deep: true })

watch(signedInUser, value => {
  if (value) localStorage.setItem('servicehub-user', JSON.stringify(value))
  else localStorage.removeItem('servicehub-user')
}, { deep: true })

const isOpsDashboard = computed(() =>
  signedInUser.value?.role === 'admin' || signedInUser.value?.role === 'provider'
)

function goTo(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function signOut() {
  signedInUser.value = null
  currentPage.value = 'home'
}

function createAccount(user) {
  signedInUser.value = {
    id: Date.now(),
    role: 'customer',
    name: user.name,
    email: user.email || `${user.phone}@servicehub.local`,
    phone: user.phone,
    location: user.location
  }
  currentPage.value = 'dashboard'
}

function signIn(payload) {
  const role = payload.role || 'customer'

  signedInUser.value = {
    id: role,
    role,
    name: role === 'admin' ? 'Admin User' : role === 'provider' ? 'Rajshahi Provider' : 'Amy',
    email: payload.email || `${role}@servicehub.local`,
    phone: payload.phone || '01XXXXXXXXX',
    location: 'Rajshahi'
  }

  currentPage.value = 'dashboard'
}

function openRequest(service) {
  selectedService.value = service
  currentPage.value = signedInUser.value ? 'request' : 'signin'
}

function submitRequest(form) {
  requests.value.unshift({
    id: Date.now(),
    ...form,
    customerId: signedInUser.value.id,
    customerName: signedInUser.value.name,
    customerLocation: signedInUser.value.location,
    status: 'pending',
    createdAt: new Date().toLocaleString()
  })

  currentPage.value = 'dashboard'
}

function requestAnotherService() {
  currentPage.value = 'home'
}
</script>

<template>
  <div class="app-shell">
    <NavBar
      :active-page="currentPage"
      :signed-in-user="signedInUser"
      :theme="theme"
      @navigate="goTo"
      @sign-out="signOut"
      @toggle-theme="toggleTheme"
    />

    <main class="app-main">
      <template v-if="currentPage === 'home'">
        <HeroSection
          @find-services="goTo('home')"
          @browse-services="goTo('home')"
          @view-tracking="goTo('tracking')"
        />
        <ServiceGrid :services="services" @request-service="openRequest" />
      </template>

      <HowItWorksPage v-else-if="currentPage === 'how'" />

      <SignInPage
        v-else-if="currentPage === 'signin'"
        @sign-in="signIn"
        @go-register="goTo('register')"
      />

      <RegisterPage
        v-else-if="currentPage === 'register'"
        @create-account="createAccount"
        @google-create-account="createAccount"
        @go-signin="goTo('signin')"
      />

      <ProviderRegisterPage
        v-else-if="currentPage === 'provider-register'"
        @go-signin="goTo('signin')"
      />

      <RequestForm
        v-else-if="currentPage === 'request'"
        :service="selectedService"
        :customer="signedInUser"
        @submit-request="submitRequest"
        @back="goTo('home')"
      />

      <CustomerDashboard
        v-else-if="currentPage === 'dashboard' && signedInUser?.role === 'customer'"
        :customer="signedInUser"
        :requests="requests"
        @request-another="requestAnotherService"
        @view-tracking="goTo('tracking')"
      />

      <ProviderDashboard
        v-else-if="currentPage === 'dashboard' && signedInUser?.role === 'provider'"
        :provider="signedInUser"
        :requests="requests"
      />

      <AdminDashboard
        v-else-if="currentPage === 'dashboard' && signedInUser?.role === 'admin'"
        :admin="signedInUser"
        :requests="requests"
      />

      <TrackingDemo
        v-else-if="currentPage === 'tracking'"
        :requests="requests"
        :signed-in-user="signedInUser"
        @back="goTo('dashboard')"
      />
    </main>

    <FooterSection v-if="!isOpsDashboard" />
  </div>
</template>
