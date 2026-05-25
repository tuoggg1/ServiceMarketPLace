<script setup>
import { computed, onMounted, ref } from 'vue'

import NavBar from './components/User/NavBar.vue'
import HeroSection from './components/User/HeroSection.vue'
import ServiceGrid from './components/User/ServiceGrid.vue'
import HowItWorksPage from './components/User/HowItWorksPage.vue'
import RegisterPage from './components/User/RegisterPage.vue'
import SignInPage from './components/User/SignInPage.vue'
import RequestForm from './components/User/RequestForm.vue'
import CustomerDashboard from './components/User/CustomerDashboard.vue'
import TrackingDemo from './components/User/TrackingDemo.vue'
import FooterSection from './components/User/FooterSection.vue'

import ProviderRegisterPage from './components/Provider/ProviderRegisterPage.vue'
import ProviderDashboard from './components/Provider/ProviderDashboard.vue'

import AdminDashboard from './components/Admin/AdminDashboard.vue'

import { services } from './data/services'

import {
  adminAssignRequest,
  adminSetChatApproval,
  createAccount,
  createServiceRequest,
  getDatabaseSnapshot,
  googleCreateAccount,
  providerRespondToRequest,
  requestChatApproval,
  resetDatabase,
  sendMessage,
  signInAccount,
  updateAccountStatus
} from './services/api'

const activePage = ref('home')
const theme = ref(localStorage.getItem('servicehub_theme') || 'light')
const signedInUser = ref(null)
const selectedService = ref(null)
const signInError = ref('')

const database = ref({
  accounts: [],
  requests: [],
  chatApprovals: []
})

const approvedProviders = computed(() => {
  return database.value.accounts.filter(
    account => account.role === 'provider' && account.status === 'approved'
  )
})

const customerRequests = computed(() => {
  if (!signedInUser.value) return []

  return database.value.requests.filter(request => {
    return request.customerId === signedInUser.value.id
  })
})

const providerRequests = computed(() => {
  if (!signedInUser.value) return []

  return database.value.requests.filter(request => {
    return request.assignedProviderId === signedInUser.value.id
  })
})

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('servicehub_theme', theme.value)
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme()
}

function goTo(page) {
  activePage.value = page
  signInError.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function refreshDatabase() {
  database.value = await getDatabaseSnapshot()
}

async function handleCreateCustomer(payload) {
  const account = await createAccount({
    ...payload,
    role: 'customer',
    status: 'active'
  })

  signedInUser.value = account
  await refreshDatabase()
  goTo('dashboard')
}

async function handleGoogleCreateCustomer(payload) {
  const account = await googleCreateAccount({
    ...payload,
    role: 'customer',
    status: 'active'
  })

  signedInUser.value = account
  await refreshDatabase()
  goTo('dashboard')
}

async function handleCreateProvider(payload) {
  await createAccount({
    ...payload,
    role: 'provider',
    status: 'pending-admin-approval'
  })

  await refreshDatabase()
  goTo('signin')
}

async function handleSignIn(payload) {
  signInError.value = ''

  try {
    signedInUser.value = await signInAccount(payload)
    await refreshDatabase()
    goTo('dashboard')
  } catch (error) {
    signInError.value = error.message
  }
}

async function handleGoogleSignIn(payload) {
  try {
    signedInUser.value = await signInAccount(payload)
    await refreshDatabase()
    goTo('dashboard')
  } catch {
    signInError.value = 'No matching Google account found. Please create an account first.'
  }
}

function handleSignOut() {
  signedInUser.value = null
  selectedService.value = null
  goTo('home')
}

function handleRequestService(service) {
  if (!signedInUser.value || signedInUser.value.role !== 'customer') {
    selectedService.value = service
    goTo('register')
    return
  }

  selectedService.value = service
  goTo('request')
}

async function handleCreateServiceRequest(payload) {
  if (!signedInUser.value || !selectedService.value) return

  await createServiceRequest({
    ...payload,
    serviceId: selectedService.value.id,
    serviceTitle: selectedService.value.title,
    category: selectedService.value.category,
    price: selectedService.value.price,
    currency: selectedService.value.currency || '৳',
    customerId: signedInUser.value.id,
    customerName: signedInUser.value.name,
    customerPhone: signedInUser.value.phone,
    customerLocation: signedInUser.value.location
  })

  selectedService.value = null
  await refreshDatabase()
  goTo('dashboard')
}

async function handleApproveProvider(providerId) {
  await updateAccountStatus(providerId, 'approved')
  await refreshDatabase()
}

async function handleRejectProvider(providerId) {
  await updateAccountStatus(providerId, 'rejected')
  await refreshDatabase()
}

async function handleAssignRequest(payload) {
  await adminAssignRequest(payload.requestId, payload.providerId)
  await refreshDatabase()
}

async function handleProviderResponse(payload) {
  await providerRespondToRequest(payload.requestId, payload.status)
  await refreshDatabase()
}

async function handleRequestChat(payload) {
  await requestChatApproval(payload.requestId, signedInUser.value.role)
  await refreshDatabase()
}

async function handleApproveChat(payload) {
  await adminSetChatApproval(payload.requestId, 'approved')
  await refreshDatabase()
}

async function handleRejectChat(payload) {
  await adminSetChatApproval(payload.requestId, 'rejected')
  await refreshDatabase()
}

async function handleSendMessage(payload) {
  await sendMessage(payload.requestId, signedInUser.value.role, payload.messageText)
  await refreshDatabase()
}

async function handleResetDemo() {
  await resetDatabase()
  signedInUser.value = null
  selectedService.value = null
  await refreshDatabase()
  goTo('home')
}

const dashboardComponent = computed(() => {
  if (!signedInUser.value) return null

  if (signedInUser.value.role === 'admin') return 'admin'
  if (signedInUser.value.role === 'provider') return 'provider'

  return 'customer'
})

onMounted(async () => {
  applyTheme()
  await refreshDatabase()
})
</script>

<template>
  <NavBar
    :active-page="activePage"
    :theme="theme"
    :signed-in-user="signedInUser"
    @navigate="goTo"
    @toggle-theme="toggleTheme"
    @sign-out="handleSignOut"
  />

  <main>
    <template v-if="activePage === 'home'">
      <HeroSection @browse-services="goTo('home')" />

      <ServiceGrid
        :services="services"
        @request-service="handleRequestService"
      />
    </template>

    <HowItWorksPage
      v-else-if="activePage === 'how'"
    />

    <RegisterPage
      v-else-if="activePage === 'register'"
      @create-account="handleCreateCustomer"
      @google-create-account="handleGoogleCreateCustomer"
      @go-signin="goTo('signin')"
    />

    <ProviderRegisterPage
      v-else-if="activePage === 'provider-register'"
      @create-provider-account="handleCreateProvider"
      @create-account="handleCreateProvider"
      @go-signin="goTo('signin')"
    />

    <SignInPage
      v-else-if="activePage === 'signin'"
      :accounts="database.accounts"
      :error-message="signInError"
      @signin="handleSignIn"
      @google-signin="handleGoogleSignIn"
      @go-register="goTo('register')"
      @go-provider-register="goTo('provider-register')"
    />

    <RequestForm
      v-else-if="activePage === 'request'"
      :service="selectedService"
      :customer="signedInUser"
      @submit-request="handleCreateServiceRequest"
      @back="goTo('home')"
    />

    <TrackingDemo
      v-else-if="activePage === 'tracking'"
      :requests="customerRequests"
      :signed-in-user="signedInUser"
      @back="goTo('dashboard')"
    />

    <template v-else-if="activePage === 'dashboard'">
      <CustomerDashboard
        v-if="dashboardComponent === 'customer'"
        :user="signedInUser"
        :requests="customerRequests"
        @request-service="goTo('home')"
        @request-chat="handleRequestChat"
        @send-message="handleSendMessage"
        @open-tracking="goTo('tracking')"
      />

      <ProviderDashboard
        v-else-if="dashboardComponent === 'provider'"
        :provider="signedInUser"
        :requests="providerRequests"
        @respond-request="handleProviderResponse"
        @request-chat="handleRequestChat"
        @send-message="handleSendMessage"
      />

      <AdminDashboard
        v-else-if="dashboardComponent === 'admin'"
        :admin="signedInUser"
        :accounts="database.accounts"
        :requests="database.requests"
        :providers="approvedProviders"
        :chat-approvals="database.chatApprovals"
        @approve-provider="handleApproveProvider"
        @reject-provider="handleRejectProvider"
        @assign-request="handleAssignRequest"
        @approve-chat="handleApproveChat"
        @reject-chat="handleRejectChat"
        @reset-demo="handleResetDemo"
      />
    </template>
  </main>

  <FooterSection v-if="activePage !== 'dashboard'" />
</template>
