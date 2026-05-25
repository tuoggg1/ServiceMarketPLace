<script setup>
// admin dashboard component: original admin operations workspace is preserved.
// Extra workflow features are added inside the existing provider/request/chat sections.
import { computed, ref } from 'vue'

const props = defineProps({
  accounts: { type: Array, default: () => [] },
  requests: { type: Array, default: () => [] },
  chatApprovals: { type: Array, default: () => [] },
  blockRequests: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'approve-provider',
  'reject-provider',
  'assign-request',
  'approve-chat',
  'reject-chat',
  'status-change',
  'block-status-change',
  'reset-db',
  'sign-out',
  'go-home'
])

const activeView = ref('dashboard')
const searchTerm = ref('')
const selectedProviders = ref({})

// Original sample tables are kept for the admin dashboard appearance.
const users = ref([
  { name: 'Rafiq Ahmed', email: 'rafiq.ahmed@email.com', phone: '+880 1712-345678', bookings: 24, spent: 45600, status: 'Active' },
  { name: 'Fatima Begum', email: 'fatima.begum@email.com', phone: '+880 1812-456789', bookings: 12, spent: 23400, status: 'Active' },
  { name: 'Karim Hassan', email: 'karim.h@email.com', phone: '+880 1912-567890', bookings: 45, spent: 89200, status: 'Blocked' },
  { name: 'Nusrat Jahan', email: 'nusrat.j@email.com', phone: '+880 1612-678901', bookings: 3, spent: 5800, status: 'Active' }
])

const sampleProviders = ref([
  { name: 'Abdul Karim', area: 'Rajshahi City', services: 'AC Repair, Installation', rating: 4.9, jobs: 456, earnings: 892000, status: 'Active' },
  { name: 'Shahidul Islam', area: 'Boalia', services: 'Electrical Wiring, Fan Installation', rating: 4.7, jobs: 312, earnings: 624000, status: 'Active' },
  { name: 'Firoz Ahmed', area: 'Laxmipur', services: 'Painting, Wall Texture', rating: 4.6, jobs: 87, earnings: 261000, status: 'Pending' },
  { name: 'Salam Khan', area: 'Motihar', services: 'Appliance Repair', rating: 'N/A', jobs: 0, earnings: 0, status: 'Pending' }
])

// Real provider accounts come from account creation/provider registration.
const customerAccounts = computed(() => props.accounts.filter(account => account.role === 'customer'))
const providerAccounts = computed(() => props.accounts.filter(account => account.role === 'provider'))
const activeProviders = computed(() => providerAccounts.value.filter(account => account.status === 'active'))
const pendingProviderAccounts = computed(() => providerAccounts.value.filter(account => account.status === 'pending-admin-approval'))

const totalRevenue = computed(() => props.requests.reduce((sum, item) => sum + Number(item.total || item.budget || 0), 45678900))
const waitingRequests = computed(() => props.requests.filter(request => request.status === 'waiting-admin-approval'))
const assignedRequests = computed(() => props.requests.filter(request => request.providerId))

const visibleRequests = computed(() => {
  const q = searchTerm.value.toLowerCase().trim()
  if (!q) return props.requests
  return props.requests.filter(item => `${item.id} ${item.serviceTitle} ${item.customerName} ${item.providerId} ${item.status}`.toLowerCase().includes(q))
})

function providerName(providerId) {
  return props.accounts.find(account => account.id === providerId)?.name || 'Not assigned'
}

function assignProvider(request) {
  const providerId = selectedProviders.value[request.id]
  if (!providerId) return alert('Please choose a provider before assigning the request.')
  emit('assign-request', { requestId: request.id, providerId })
}

function toggleUserStatus(user) { user.status = user.status === 'Blocked' ? 'Active' : 'Blocked' }
function toggleSampleProviderStatus(provider) { provider.status = provider.status === 'Blocked' ? 'Active' : 'Blocked' }
function approveSampleProvider(provider) { provider.status = 'Active' }
function updateBlockStatus(request, status) { emit('block-status-change', { id: request.id, status }) }
</script>

<template>
  <section class="ops-layout admin-layout">
    <aside class="ops-sidebar">
      <div class="ops-user">
        <div class="avatar">AD</div>
        <div><strong>Admin Panel</strong><small>admin@servicehub.local</small></div>
      </div>
      <nav class="ops-menu">
        <button :class="{ active: activeView === 'dashboard' }" @click="activeView = 'dashboard'">Dashboard</button>
        <button :class="{ active: activeView === 'users' }" @click="activeView = 'users'">Users</button>
        <button :class="{ active: activeView === 'providers' }" @click="activeView = 'providers'">Service
          providers</button>
        <button :class="{ active: activeView === 'requests' }" @click="activeView = 'requests'">Requests</button>
        <button :class="{ active: activeView === 'chat' }" @click="activeView = 'chat'">Chat approvals</button>
        <button :class="{ active: activeView === 'analytics' }" @click="activeView = 'analytics'">Analytics</button>
        <button :class="{ active: activeView === 'blocks' }" @click="activeView = 'blocks'">Block requests</button>
        <button :class="{ active: activeView === 'settings' }" @click="activeView = 'settings'">Settings</button>
      </nav>
      <div class="ops-bottom"><button @click="$emit('go-home')">Back to home</button><button
          @click="$emit('sign-out')">Exit admin</button></div>
    </aside>

    <main class="ops-main">
      <header class="ops-topbar">
        <div>
          <h1>{{ activeView === 'dashboard' ? 'Admin dashboard' : activeView }}</h1>
          <p>Manage users, providers, request assignment and chat approval.</p>
        </div>
        <input v-model="searchTerm" placeholder="Search..." />
      </header>

      <template v-if="activeView === 'dashboard'">
        <div class="stat-grid four">
          <article class="stat-card dark"><span>Total users</span><strong>{{ customerAccounts.length + users.length
              }}</strong><small>registered + sample records</small></article>
          <article class="stat-card dark"><span>Service providers</span><strong>{{ providerAccounts.length +
              sampleProviders.length }}</strong><small>{{ pendingProviderAccounts.length }} pending approval</small>
          </article>
          <article class="stat-card dark"><span>Total requests</span><strong>{{ requests.length }}</strong><small>{{
            waitingRequests.length }} waiting assignment</small></article>
          <article class="stat-card dark"><span>Total revenue</span><strong>BDT {{ totalRevenue.toLocaleString()
              }}</strong><small>prototype estimate</small></article>
        </div>
        <div class="stat-grid four compact">
          <article class="stat-card dark"><span>Waiting requests</span><strong>{{ waitingRequests.length }}</strong>
          </article>
          <article class="stat-card dark"><span>Active providers</span><strong>{{ activeProviders.length }}</strong>
          </article>
          <article class="stat-card dark"><span>Chat approvals</span><strong>{{ chatApprovals.length }}</strong>
          </article>
          <article class="stat-card dark"><span>Assigned requests</span><strong>{{ assignedRequests.length }}</strong>
          </article>
        </div>
        <div class="ops-grid two">
          <section class="ops-panel">
            <h2>Recent requests</h2>
            <div v-if="requests.length === 0" class="empty-state">No service requests submitted yet.</div>
            <article v-for="request in requests.slice(0, 4)" :key="request.id" class="request-row">
              <div><strong>{{ request.serviceTitle }}</strong><small>{{ request.customerName }} · {{
                request.preferredDate }}</small></div><strong>BDT {{ Number(request.budget || request.total ||
                    0).toLocaleString() }}</strong>
            </article>
          </section>
          <section class="ops-panel">
            <h2>Pending provider approvals</h2>
            <div v-if="pendingProviderAccounts.length === 0" class="empty-state">No real provider applications pending.
            </div>
            <article v-for="provider in pendingProviderAccounts" :key="provider.id" class="request-row">
              <div><strong>{{ provider.name }}</strong><small>{{ provider.serviceType }} · {{ provider.email }}</small>
              </div>
              <div class="row-actions"><button class="primary small"
                  @click="$emit('approve-provider', provider.id)">Approve</button><button class="secondary small"
                  @click="$emit('reject-provider', provider.id)">Reject</button></div>
            </article>
          </section>
        </div>
      </template>

      <template v-if="activeView === 'users'">
        <section class="ops-panel">
          <div class="panel-heading">
            <h2>User management</h2><span>Showing {{ users.length + customerAccounts.length }} users</span>
          </div>
          <div class="responsive-table dark-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Bookings</th>
                  <th>Total spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in customerAccounts" :key="account.id">
                  <td><strong>{{ account.name }}</strong><small>real customer account</small></td>
                  <td>{{ account.email }}<small>{{ account.authProvider || 'email' }}</small></td>
                  <td>{{requests.filter(r => r.customerId === account.id).length}}</td>
                  <td>backend</td>
                  <td><span class="status-pill" :class="account.status">{{ account.status }}</span></td>
                  <td><button class="secondary small">View</button></td>
                </tr>
                <tr v-for="user in users" :key="user.email">
                  <td><strong>{{ user.name }}</strong><small>sample customer account</small></td>
                  <td>{{ user.email }}<small>{{ user.phone }}</small></td>
                  <td>{{ user.bookings }}</td>
                  <td>{{ user.spent.toLocaleString() }}৳</td>
                  <td><span class="status-pill" :class="user.status.toLowerCase()">{{ user.status }}</span></td>
                  <td><button class="secondary small" @click="toggleUserStatus(user)">{{ user.status === 'Blocked' ?
                      'Unblock' : 'Block' }}</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'providers'">
        <section class="ops-panel">
          <div class="panel-heading">
            <h2>Service provider management</h2><span>Real providers + original sample table</span>
          </div>
          <div class="responsive-table dark-table">
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Services</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Earnings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="provider in providerAccounts" :key="provider.id">
                  <td><strong>{{ provider.name }}</strong><small>{{ provider.area || 'Service area pending' }}</small>
                  </td>
                  <td>{{ provider.serviceType || 'General service' }}</td>
                  <td>N/A</td>
                  <td>{{requests.filter(r => r.providerId === provider.id).length}}</td>
                  <td>backend</td>
                  <td><span class="status-pill" :class="provider.status">{{ provider.status }}</span></td>
                  <td><button v-if="provider.status === 'pending-admin-approval'" class="primary small"
                      @click="$emit('approve-provider', provider.id)">Approve</button><button
                      v-if="provider.status === 'pending-admin-approval'" class="secondary small"
                      @click="$emit('reject-provider', provider.id)">Reject</button><button v-else
                      class="secondary small">View</button></td>
                </tr>
                <tr v-for="provider in sampleProviders" :key="provider.name">
                  <td><strong>{{ provider.name }}</strong><small>{{ provider.area }}</small></td>
                  <td>{{ provider.services }}</td>
                  <td>{{ provider.rating }}</td>
                  <td>{{ provider.jobs }}</td>
                  <td>{{ provider.earnings.toLocaleString() }}৳</td>
                  <td><span class="status-pill" :class="provider.status.toLowerCase()">{{ provider.status }}</span></td>
                  <td><button v-if="provider.status === 'Pending'" class="primary small"
                      @click="approveSampleProvider(provider)">Approve</button><button v-else class="secondary small"
                      @click="toggleSampleProviderStatus(provider)">{{ provider.status === 'Blocked' ? 'Unblock' :
                      'Block' }}</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'requests'">
        <div class="stat-grid six">
          <article
            v-for="status in ['All', 'waiting-admin-approval', 'assigned-to-provider', 'provider-accepted', 'provider-declined', 'completed']"
            :key="status" class="stat-card dark"><span>{{ status }}</span><strong>{{status === 'All' ? requests.length
              : requests.filter(r => r.status === status).length }}</strong></article>
        </div>
        <section class="ops-panel">
          <h2>Service request approval and provider assignment</h2>
          <div v-if="requests.length === 0" class="empty-state">No customer service requests yet.</div>
          <div v-else class="responsive-table dark-table">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Schedule</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in visibleRequests" :key="request.id">
                  <td><strong>{{ request.id }}</strong></td>
                  <td>{{ request.serviceTitle }}</td>
                  <td>{{ request.customerName }}</td>
                  <td>{{ providerName(request.providerId) }}<small>{{ request.providerStatus }}</small></td>
                  <td>{{ request.preferredDate }}<small>{{ request.location }}</small></td>
                  <td>{{ request.budget || request.total || 0 }}৳</td>
                  <td><span class="status-pill"
                      :class="String(request.status).toLowerCase().replaceAll('_', '-').replaceAll(' ', '-')">{{
                      request.status }}</span></td>
                  <td>
                    <div class="row-actions"><select v-model="selectedProviders[request.id]">
                        <option value="">Choose provider</option>
                        <option v-for="provider in activeProviders" :key="provider.id" :value="provider.id">{{
                          provider.name }} - {{ provider.serviceType }}</option>
                      </select><button class="primary small" @click="assignProvider(request)">Approve + assign</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'chat'">
        <section class="ops-panel">
          <div class="panel-heading">
            <h2>Chat approval requests</h2><span>{{ chatApprovals.length }} submitted</span>
          </div>
          <p class="muted">User and provider chat is locked until admin approves the request.</p>
          <div v-if="chatApprovals.length === 0" class="empty-state">No chat approval requests yet.</div>
          <div v-else class="responsive-table dark-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request</th>
                  <th>Requested by</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="approval in chatApprovals" :key="approval.id">
                  <td><strong>{{ approval.id }}</strong></td>
                  <td>{{ approval.requestId }}</td>
                  <td>{{ approval.requestedBy }}</td>
                  <td><span class="status-pill" :class="approval.status">{{ approval.status }}</span></td>
                  <td class="row-actions"><button class="success small"
                      @click="$emit('approve-chat', approval.id)">Approve</button><button class="secondary small"
                      @click="$emit('reject-chat', approval.id)">Reject</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'blocks'">
        <section class="ops-panel">
          <div class="panel-heading">
            <h2>Block requests</h2><span>{{ blockRequests.length }} submitted</span>
          </div>
          <div v-if="blockRequests.length === 0" class="empty-state">No block requests yet.</div>
          <div v-else class="responsive-table dark-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requested by</th>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in blockRequests" :key="request.id">
                  <td><strong>{{ request.id }}</strong></td>
                  <td>{{ request.requesterName }}<small>{{ request.requesterRole }}</small></td>
                  <td>{{ request.targetName }}<small>{{ request.targetRole }}</small></td>
                  <td>{{ request.reason }}</td>
                  <td><span class="status-pill" :class="request.status.toLowerCase()">{{ request.status }}</span></td>
                  <td class="row-actions"><button class="success small"
                      @click="updateBlockStatus(request, 'Approved')">Approve</button><button class="secondary small"
                      @click="updateBlockStatus(request, 'Rejected')">Reject</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'analytics'">
        <section class="ops-panel">
          <h2>Marketplace analytics</h2>
          <div class="analytics-grid">
            <article><span>Conversion rate</span><strong>38%</strong>
              <p>request submissions from service views</p>
            </article>
            <article><span>Average response time</span><strong>22 min</strong>
              <p>provider first response estimate</p>
            </article>
            <article><span>Top area</span><strong>Rajshahi City</strong>
              <p>highest request volume</p>
            </article>
          </div>
        </section>
      </template>

      <template v-if="activeView === 'settings'">
        <section class="ops-panel settings-panel">
          <h2>Admin settings</h2>
          <div class="settings-grid"><label>Platform name<input value="Service Hub" /></label><label>Default city<input
                value="Rajshahi City" /></label><label>Support email<input
                value="support@servicehub.com" /></label><label>Backend status<input
                value="ready for real database API connection" /></label></div>
          <div class="form-actions"><button class="secondary" @click="$emit('reset-db')">Reset local demo
              database</button><button class="primary">Save settings</button></div>
        </section>
      </template>
    </main>
  </section>
</template>
