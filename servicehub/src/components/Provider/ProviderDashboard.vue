<script setup>
// provider dashboard component: this keeps the original operations-dashboard structure
// and adds the new backend-ready workflow features without removing existing sections.
import { computed, ref } from 'vue'

const props = defineProps({
  currentUser: { type: Object, default: null },
  requests: { type: Array, default: () => [] },
  chatApprovals: { type: Array, default: () => [] },
  messages: { type: Array, default: () => [] },
  providerName: { type: String, default: '' }
})

const emit = defineEmits([
  'accept-request',
  'decline-request',
  'status-change',
  'request-chat',
  'send-message',
  'block-request',
  'sign-out',
  'go-home'
])

// activeView keeps the original provider sidebar/page structure.
const activeView = ref('dashboard')
const searchTerm = ref('')
const declineTarget = ref(null)
const declineReason = ref('')
const replyTarget = ref(null)
const replyText = ref('')
const blockTargetName = ref('')
const blockReason = ref('')
const messageByRequest = ref({})

const displayName = computed(() => props.providerName || props.currentUser?.name || 'Provider')
const providerService = computed(() => props.currentUser?.serviceType || 'General service')
const avatarText = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase())

// Only admin-assigned requests are shown to this provider.
const providerRequests = computed(() => {
  if (!props.currentUser?.id) return []
  return props.requests.filter(request => request.providerId === props.currentUser.id)
})

const pendingRequests = computed(() => providerRequests.value.filter(item => item.providerStatus === 'waiting-provider-acceptance'))
const activeJobs = computed(() => providerRequests.value.filter(item => ['accepted', 'in-progress'].includes(item.providerStatus)))
const completedJobs = computed(() => providerRequests.value.filter(item => item.status === 'completed' || item.providerStatus === 'completed'))
const monthlyEstimate = computed(() => activeJobs.value.reduce((sum, item) => sum + Number(item.total || item.budget || 0), 0))

const filteredRequests = computed(() => {
  const q = searchTerm.value.toLowerCase().trim()
  if (!q) return providerRequests.value
  return providerRequests.value.filter(item => `${item.serviceTitle} ${item.customerName} ${item.location} ${item.status} ${item.providerStatus}`.toLowerCase().includes(q))
})

function chatStatus(requestId) {
  return props.chatApprovals.find(item => item.requestId === requestId)?.status || 'not-requested'
}

function requestChat(request) {
  emit('request-chat', { requestId: request.id, requestedBy: 'provider' })
}

function submitMessage(requestId) {
  const message = messageByRequest.value[requestId]
  if (!message?.trim()) return
  emit('send-message', { requestId, senderRole: 'provider', message })
  messageByRequest.value[requestId] = ''
}

function acceptRequest(request) {
  emit('accept-request', { requestId: request.id, providerId: props.currentUser?.id })
}

function openDeclineModal(request) {
  declineTarget.value = request
  declineReason.value = ''
}

function confirmDecline() {
  if (!declineReason.value.trim()) return
  emit('decline-request', { requestId: declineTarget.value.id, providerId: props.currentUser?.id, reason: declineReason.value })
  declineTarget.value = null
}

function startJob(request) {
  emit('status-change', { requestId: request.id, status: 'in-progress' })
}

function completeJob(request) {
  emit('status-change', { requestId: request.id, status: 'completed' })
}

function saveReply() {
  if (!replyText.value.trim()) return
  replyTarget.value.reply = replyText.value
  replyTarget.value.replied = true
  replyTarget.value = null
  replyText.value = ''
}

function requestCustomerBlock() {
  if (!blockTargetName.value.trim() || !blockReason.value.trim()) return
  emit('block-request', { targetName: blockTargetName.value, targetRole: 'customer', reason: blockReason.value })
  blockTargetName.value = ''
  blockReason.value = ''
}

const reviews = ref([
  { name: 'Rafiq Ahmed', service: 'AC Repair', rating: 5, text: 'Excellent service. The provider arrived on time and explained the repair clearly.', replied: true, reply: 'Thank you for your kind feedback.' },
  { name: 'Sabrina Khan', service: 'AC Servicing', rating: 5, text: 'Very thorough servicing and professional communication.', replied: false, reply: '' },
  { name: 'Mohammad Ali', service: 'AC Installation', rating: 4, text: 'Good installation work. It took slightly longer than expected, but the quality was excellent.', replied: true, reply: 'Thank you. We always try to maintain quality installation.' }
])
</script>

<template>
  <section class="ops-layout">
    <aside class="ops-sidebar">
      <div class="ops-user">
        <div class="avatar">{{ avatarText }}</div>
        <div><strong>{{ displayName }}</strong><small>{{ providerService }} provider</small></div>
      </div>
      <nav class="ops-menu">
        <button :class="{ active: activeView === 'dashboard' }" @click="activeView = 'dashboard'">Dashboard</button>
        <button :class="{ active: activeView === 'services' }" @click="activeView = 'services'">My services</button>
        <button :class="{ active: activeView === 'requests' }" @click="activeView = 'requests'">Requests</button>
        <button :class="{ active: activeView === 'messages' }" @click="activeView = 'messages'">Messages</button>
        <button :class="{ active: activeView === 'reviews' }" @click="activeView = 'reviews'">Reviews</button>
        <button :class="{ active: activeView === 'settings' }" @click="activeView = 'settings'">Settings</button>
      </nav>
      <div class="ops-bottom">
        <button @click="$emit('go-home')">Back to home</button>
        <button @click="$emit('sign-out')">Sign out</button>
      </div>
    </aside>

    <main class="ops-main">
      <header class="ops-topbar">
        <div>
          <h1>{{ activeView === 'dashboard' ? 'Provider dashboard' : activeView }}</h1>
          <p>Manage your services, admin-assigned requests and approved customer communication.</p>
        </div>
        <input v-model="searchTerm" placeholder="Search..." />
      </header>

      <template v-if="activeView === 'dashboard'">
        <div class="stat-grid four">
          <article class="stat-card dark"><span>Total earnings</span><strong>৳{{ monthlyEstimate.toLocaleString()
              }}</strong><small>backend-ready estimate</small></article>
          <article class="stat-card dark"><span>Waiting acceptance</span><strong>{{ pendingRequests.length
              }}</strong><small>assigned by admin</small></article>
          <article class="stat-card dark"><span>Total jobs</span><strong>{{ providerRequests.length
              }}</strong><small>all assigned records</small></article>
          <article class="stat-card dark"><span>Average rating</span><strong>4.8</strong><small>{{ reviews.length }}
              reviews</small></article>
        </div>
        <div class="ops-grid two">
          <section class="ops-panel">
            <div class="panel-heading">
              <h2>Pending assigned requests</h2><button @click="activeView = 'requests'">View all</button>
            </div>
            <div v-if="pendingRequests.length === 0" class="empty-state">No admin-assigned requests waiting for
              acceptance.</div>
            <article v-for="request in pendingRequests" :key="request.id" class="request-row">
              <div><strong>{{ request.serviceTitle }}</strong><small>{{ request.customerName }} · {{
                request.preferredDate }} · ৳{{ request.budget || request.total || 0 }}</small></div>
              <div><button class="secondary small" @click="openDeclineModal(request)">Decline</button><button
                  class="primary small" @click="acceptRequest(request)">Accept</button></div>
            </article>
          </section>
          <section class="ops-panel">
            <div class="panel-heading">
              <h2>Recent reviews</h2><button @click="activeView = 'reviews'">View all</button>
            </div>
            <article v-for="review in reviews.slice(0, 2)" :key="review.name" class="review-row"><strong>{{ review.name
                }}</strong><small>{{ review.service }} · {{ review.rating }}/5</small>
              <p>{{ review.text }}</p>
            </article>
          </section>
        </div>
      </template>

      <template v-if="activeView === 'services'">
        <div class="stat-grid three">
          <article class="stat-card dark"><span>Total services</span><strong>4</strong></article>
          <article class="stat-card dark"><span>Active services</span><strong>3</strong></article>
          <article class="stat-card dark"><span>Inactive services</span><strong>1</strong></article>
        </div>
        <section class="ops-panel">
          <div class="panel-heading">
            <h2>Your services</h2><button class="primary small">Add new service</button>
          </div>
          <article
            v-for="service in ['AC Repair & Troubleshooting', 'AC Installation', 'AC Servicing & Maintenance', 'Emergency AC Repair']"
            :key="service" class="service-line">
            <div><strong>{{ service }}</strong>
              <p>Professional local service with clear pricing and availability.</p><small>৳800+ · 1-2 hours · ready for
                backend table connection</small>
            </div>
            <label class="switch"><input type="checkbox" checked><span></span></label>
          </article>
        </section>
      </template>

      <template v-if="activeView === 'requests'">
        <div class="stat-grid four">
          <article class="stat-card dark"><span>Waiting</span><strong>{{ pendingRequests.length }}</strong></article>
          <article class="stat-card dark"><span>Active jobs</span><strong>{{ activeJobs.length }}</strong></article>
          <article class="stat-card dark"><span>Completed</span><strong>{{ completedJobs.length }}</strong></article>
          <article class="stat-card dark"><span>Total requests</span><strong>{{ providerRequests.length }}</strong>
          </article>
        </div>
        <section class="ops-panel">
          <div class="tab-row"><button
              class="active">All</button><button>Waiting</button><button>Active</button><button>Completed</button></div>
          <div v-if="filteredRequests.length === 0" class="empty-state">No requests assigned by admin yet.</div>
          <article v-for="request in filteredRequests" :key="request.id" class="large-request-row">
            <div>
              <h3>{{ request.serviceTitle }}</h3>
              <p>{{ request.customerName }} · {{ request.location }} · {{ request.preferredDate }}</p>
              <small>{{ request.details }}</small>
            </div>
            <strong>৳{{ request.budget || request.total || 0 }}</strong>
            <span class="status-pill"
              :class="String(request.providerStatus || request.status).toLowerCase().replaceAll(' ', '-').replaceAll('_', '-')">{{
                request.providerStatus || request.status }}</span>
            <div class="row-actions">
              <button v-if="request.providerStatus === 'waiting-provider-acceptance'" class="secondary small"
                @click="openDeclineModal(request)">Decline</button>
              <button v-if="request.providerStatus === 'waiting-provider-acceptance'" class="primary small"
                @click="acceptRequest(request)">Accept</button>
              <button v-if="request.providerStatus === 'accepted'" class="primary small"
                @click="startJob(request)">Start job</button>
              <button v-if="request.providerStatus === 'in-progress'" class="success small"
                @click="completeJob(request)">Complete</button>
            </div>
          </article>
        </section>
      </template>

      <template v-if="activeView === 'messages'">
        <section class="ops-panel messages-panel">
          <aside>
            <input placeholder="Search conversations..." />
            <button v-for="request in providerRequests" :key="request.id" @click="requestChat(request)">
              {{ request.customerName }}<small>{{ request.serviceTitle }} · chat: {{ chatStatus(request.id) }}</small>
            </button>
          </aside>
          <div class="chat-empty" v-if="providerRequests.length === 0">
            <h2>Your messages</h2>
            <p>Only admin-assigned request conversations appear here.</p>
          </div>
          <div v-else class="chat-empty">
            <h2>Admin-approved chat only</h2>
            <p>Click a customer to request admin chat approval. Chat box appears inside each request after approval.</p>
          </div>
        </section>
        <section class="ops-panel">
          <h2>Approved chat rooms</h2>
          <article v-for="request in providerRequests" :key="request.id" class="review-row">
            <strong>{{ request.customerName }} · {{ request.serviceTitle }}</strong><small>Chat status: {{
              chatStatus(request.id) }}</small>
            <button v-if="chatStatus(request.id) !== 'approved'" class="secondary small"
              @click="requestChat(request)">Request admin approval</button>
            <div v-else>
              <p v-for="m in messages.filter(item => item.requestId === request.id)" :key="m.id"><strong>{{ m.senderRole
                  }}:</strong> {{ m.message }}</p>
              <div class="form-actions"><input v-model="messageByRequest[request.id]"
                  placeholder="Message customer" /><button class="primary small"
                  @click="submitMessage(request.id)">Send</button></div>
            </div>
          </article>
        </section>
      </template>

      <template v-if="activeView === 'reviews'">
        <div class="stat-grid four">
          <article class="stat-card dark"><span>Average rating</span><strong>4.6</strong></article>
          <article class="stat-card dark"><span>Total reviews</span><strong>{{ reviews.length }}</strong></article>
          <article class="stat-card dark"><span>Response rate</span><strong>67%</strong></article>
          <article class="stat-card dark"><span>Pending replies</span><strong>{{reviews.filter(r => !r.replied).length
              }}</strong></article>
        </div>
        <section class="ops-panel">
          <h2>Customer reviews</h2>
          <article v-for="review in reviews" :key="review.name" class="review-row expanded">
            <div><strong>{{ review.name }}</strong><small>{{ review.service }} · {{ review.rating }}/5</small>
              <p>{{ review.text }}</p>
              <p v-if="review.reply" class="reply-box">{{ review.reply }}</p>
            </div>
            <button v-if="!review.reply" class="primary small" @click="replyTarget = review">Reply</button>
          </article>
        </section>
      </template>

      <template v-if="activeView === 'settings'">
        <section class="ops-panel">
          <h2>Safety request</h2>
          <p class="muted">Request to block a customer. Admin reviews it before any action is applied.</p>
          <div class="settings-grid"><label>Customer name<input v-model="blockTargetName"
                placeholder="Customer name from request" /></label><label>Reason<input v-model="blockReason"
                placeholder="Reason for admin review" /></label></div><button class="secondary small"
            @click="requestCustomerBlock">Send block request</button>
        </section>
        <section class="ops-panel settings-panel">
          <h2>Profile information</h2>
          <div class="settings-grid"><label>Full name<input :value="displayName" /></label><label>Phone number<input
                value="+880 1711-111111" /></label><label>Email address<input
                :value="currentUser?.email" /></label><label>Service area<input value="Rajshahi City" /></label><label
              class="full">Bio<textarea
                rows="4">Experienced service provider with verified local support history.</textarea></label></div>
          <button class="primary">Save changes</button>
        </section>
      </template>
    </main>

    <section v-if="declineTarget" class="modal-backdrop" @click.self="declineTarget = null">
      <div class="modal-card"><button class="icon-close" @click="declineTarget = null">close</button>
        <h2>Decline request</h2>
        <p>Provide a reason. This can be shared with admin/customer.</p><label>Reason<textarea v-model="declineReason"
            rows="4" placeholder="Schedule conflict, outside service area, unavailable items..."></textarea></label>
        <div class="form-actions"><button class="secondary" @click="declineTarget = null">Cancel</button><button
            class="danger" @click="confirmDecline">Decline request</button></div>
      </div>
    </section>
    <section v-if="replyTarget" class="modal-backdrop" @click.self="replyTarget = null">
      <div class="modal-card"><button class="icon-close" @click="replyTarget = null">close</button>
        <h2>Reply to review</h2><textarea v-model="replyText" rows="5"
          placeholder="Write a professional response..."></textarea>
        <div class="form-actions"><button class="secondary" @click="replyTarget = null">Cancel</button><button
            class="primary" @click="saveReply">Save reply</button></div>
      </div>
    </section>
  </section>
</template>
