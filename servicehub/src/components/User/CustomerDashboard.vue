<script setup>
import { computed, ref } from 'vue'

// Customer dashboard: tracks submitted requests and controlled chat approval flow.
const props = defineProps({ currentUser: Object, requests: Array, chatApprovals: Array, messages: Array })
const emit = defineEmits(['go', 'request-chat', 'send-message'])
const messageByRequest = ref({})
const myRequests = computed(() => props.requests.filter(r => r.customerId === props.currentUser?.id))

function chatStatus(requestId) {
  return props.chatApprovals.find(c => c.requestId === requestId)?.status || 'not-requested'
}

function submitMessage(requestId) {
  const message = messageByRequest.value[requestId]
  if (!message) return
  emit('send-message', { requestId, senderRole: 'customer', message })
  messageByRequest.value[requestId] = ''
}
</script>

<template>
  <section class="page-section">
    <div class="dashboard-hero clean-card">
      <div>
        <p class="eyebrow">Customer dashboard</p>
        <h2>Welcome, {{ currentUser?.name }}</h2>
        <p class="muted">View request status and request admin approval before chatting with a provider.</p>
      </div><button class="primary" @click="$emit('go', 'home')">Request another service</button>
    </div>
    <div v-if="myRequests.length === 0" class="empty-state">No service requests yet.</div>
    <div v-else class="notice-list">
      <article v-for="request in myRequests" :key="request.id" class="notice">
        <div class="panel-heading">
          <div>
            <h3>{{ request.serviceTitle }}</h3>
            <p class="muted">{{ request.location }} · {{ request.preferredDate }}</p>
          </div><span class="status-pill" :class="request.status">{{ request.status }}</span>
        </div>
        <p>{{ request.details }}</p>
        <div class="badge-row"><span class="status-pill">Provider: {{ request.providerStatus }}</span><span
            class="status-pill">Chat: {{ chatStatus(request.id) }}</span></div>
        <div class="inline-actions" style="margin-top:14px"><button class="secondary small"
            @click="$emit('request-chat', { requestId: request.id, requestedBy: 'customer' })">Request chat
            approval</button></div>
        <div v-if="chatStatus(request.id) === 'approved'" class="chat-box" style="margin-top:14px">
          <div v-for="m in messages.filter(item => item.requestId === request.id)" :key="m.id" class="chat-message">
            <strong>{{ m.senderRole }}</strong>{{ m.message }}</div>
          <div class="chat-compose"><input v-model="messageByRequest[request.id]"
              placeholder="Message provider" /><button class="primary small"
              @click="submitMessage(request.id)">Send</button></div>
        </div>
      </article>
    </div>
  </section>
</template>
