// servicehub local database api
// this version matches the existing App.vue, AdminDashboard.vue and ProviderDashboard.vue props/status names.

const DB_KEY = 'servicehub_database'

const DEMO_PROVIDER = {
  id: 'provider-demo-rajshahi',
  providerId: 'PROV-DEMO-01',
  role: 'provider',
  name: 'Rajshahi Provider',
  phone: '01700000001',
  email: 'provider@servicehub.local',
  password: 'provider123',
  location: 'Rajshahi City',
  serviceType: 'AC Repair & Home Maintenance',
  status: 'active',
  rating: 4.8,
  completedJobs: 18,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z'
}

const EMPTY_DB = {
  accounts: [DEMO_PROVIDER],
  requests: [],
  chatApprovals: []
}

function ensureDemoData(db) {
  const hasDemoProvider = db.accounts.some(account => account.providerId === DEMO_PROVIDER.providerId)
  if (!hasDemoProvider) db.accounts.unshift(copy(DEMO_PROVIDER))
  return db
}

function copy(value) {
  return JSON.parse(JSON.stringify(value))
}

function loadDb() {
  try {
    const saved = localStorage.getItem(DB_KEY)
    const parsed = saved ? JSON.parse(saved) : copy(EMPTY_DB)

    return ensureDemoData({
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      chatApprovals: Array.isArray(parsed.chatApprovals) ? parsed.chatApprovals : []
    })
  } catch (error) {
    console.warn('servicehub database was reset because localStorage data was invalid.', error)
    return copy(EMPTY_DB)
  }
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  return db
}

function makeId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function clean(value) {
  return String(value || '').trim().toLowerCase()
}

function safeAccount(account) {
  if (!account) return null
  const { password, ...safe } = account
  return safe
}

function normaliseProviderStatus(status) {
  if (status === 'approved') return 'active'
  return status
}

export async function getDatabaseSnapshot() {
  return loadDb()
}

export async function createAccount(accountData) {
  const db = loadDb()
  const role = accountData.role || 'customer'

  if (!accountData.name || !accountData.phone || !accountData.location || !accountData.password) {
    throw new Error('Name, phone, location and password are required.')
  }

  const duplicate = db.accounts.some(account =>
    account.role === role &&
    (clean(account.name) === clean(accountData.name) || clean(account.phone) === clean(accountData.phone))
  )

  if (duplicate) {
    throw new Error('An account with this name or phone already exists.')
  }

  const account = {
    id: makeId(role),
    role,
    name: accountData.name.trim(),
    phone: accountData.phone.trim(),
    location: accountData.location,
    password: accountData.password,
    email: accountData.email || `${clean(accountData.name).replace(/\s+/g, '.')}@servicehub.local`,
    serviceType: accountData.serviceType || accountData.service || 'General service',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: role === 'provider' ? 'pending-admin-approval' : 'active'
  }

  if (role === 'provider') {
    account.providerId = accountData.providerId || `PROV-${Math.floor(10000 + Math.random() * 90000)}`
    account.rating = 0
    account.completedJobs = 0
  }

  db.accounts.push(account)
  saveDb(db)
  return safeAccount(account)
}

export async function googleCreateAccount(accountData) {
  return createAccount({
    ...accountData,
    accountMethod: 'google'
  })
}

export async function googleSignInAccount(accountData = {}) {
  const db = loadDb()
  const role = accountData.role || 'customer'
  const email = accountData.email || 'google.customer@servicehub.local'
  let account = db.accounts.find(item => item.role === role && clean(item.email) === clean(email))

  if (!account) {
    account = {
      id: makeId(role),
      role,
      name: accountData.name || 'Google Customer',
      phone: accountData.phone || '01700000002',
      location: accountData.location || 'Rajshahi City',
      password: 'google-oauth-demo',
      email,
      accountMethod: 'google',
      serviceType: accountData.serviceType || 'General service',
      status: role === 'provider' ? 'pending-admin-approval' : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    if (role === 'provider') {
      account.providerId = accountData.providerId || `PROV-${Math.floor(10000 + Math.random() * 90000)}`
      account.rating = 0
      account.completedJobs = 0
    }
    db.accounts.push(account)
    saveDb(db)
  }

  if (role === 'provider' && !['active', 'approved'].includes(account.status)) {
    throw new Error('Provider Google account is waiting for admin approval.')
  }

  return safeAccount(account)
}

export async function signInAccount({ role = 'customer', identifier = '', password = '' }) {
  const db = loadDb()

  if (role === 'admin') {
    const id = clean(identifier)
    if ((id === 'admin01' || id === 'admin') && password === 'admin123') {
      return {
        id: 'admin01',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@servicehub.local',
        status: 'active'
      }
    }
    throw new Error('Invalid admin credentials. Use admin01 / admin123 for the demo.')
  }

  const account = db.accounts.find(item => {
    if (item.role !== role) return false

    if (role === 'customer') {
      return (clean(item.name) === clean(identifier) || clean(item.phone) === clean(identifier)) && item.password === password
    }

    return (clean(item.providerId) === clean(identifier) || clean(item.name) === clean(identifier)) && item.password === password
  })

  if (!account) throw new Error('No matching account found.')

  if (role === 'provider' && !['active', 'approved'].includes(account.status)) {
    throw new Error('Provider account is waiting for admin approval.')
  }

  return safeAccount({ ...account, status: normaliseProviderStatus(account.status) })
}

export async function updateAccountStatus(accountId, status) {
  const db = loadDb()
  const account = db.accounts.find(item => item.id === accountId)

  if (!account) throw new Error('Account not found.')

  account.status = normaliseProviderStatus(status)
  account.updatedAt = new Date().toISOString()
  saveDb(db)
  return safeAccount(account)
}

export async function createServiceRequest(requestData) {
  const db = loadDb()

  const request = {
    id: makeId('request'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // names expected by the existing dashboards
    status: 'waiting-admin-approval',
    providerStatus: 'waiting-admin-assignment',
    chatStatus: 'not-approved',
    providerId: '',
    assignedProviderId: '',
    assignedProviderName: '',
    messages: [],

    ...requestData
  }

  db.requests.unshift(request)
  saveDb(db)
  return request
}

export async function adminAssignRequest(requestId, providerId) {
  const db = loadDb()
  const request = db.requests.find(item => item.id === requestId)
  const provider = db.accounts.find(item => item.id === providerId && item.role === 'provider')

  if (!request) throw new Error('Request not found.')
  if (!provider) throw new Error('Provider not found.')
  if (!['active', 'approved'].includes(provider.status)) throw new Error('Provider must be approved before assignment.')

  request.providerId = provider.id
  request.assignedProviderId = provider.id
  request.assignedProviderName = provider.name
  request.status = 'assigned'
  request.providerStatus = 'waiting-provider-acceptance'
  request.updatedAt = new Date().toISOString()

  saveDb(db)
  return request
}

export async function providerRespondToRequest(requestId, status) {
  const db = loadDb()
  const request = db.requests.find(item => item.id === requestId)

  if (!request) throw new Error('Request not found.')

  request.providerStatus = status

  if (status === 'accepted') request.status = 'active'
  if (status === 'declined') request.status = 'declined'
  if (status === 'in-progress') request.status = 'in-progress'
  if (status === 'completed') request.status = 'completed'

  request.updatedAt = new Date().toISOString()
  saveDb(db)
  return request
}

export async function requestChatApproval(requestId, requestedBy = 'provider') {
  const db = loadDb()
  const request = db.requests.find(item => item.id === requestId)

  if (!request) throw new Error('Request not found.')

  request.chatStatus = 'pending'
  request.updatedAt = new Date().toISOString()

  const existing = db.chatApprovals.find(item => item.requestId === requestId && item.status === 'pending')
  if (!existing) {
    db.chatApprovals.unshift({
      id: makeId('chat'),
      requestId,
      requestedBy,
      status: 'pending',
      createdAt: new Date().toISOString()
    })
  }

  saveDb(db)
  return request
}

export async function adminSetChatApproval(requestId, status) {
  const db = loadDb()
  const request = db.requests.find(item => item.id === requestId)

  if (!request) throw new Error('Request not found.')

  request.chatStatus = status
  request.updatedAt = new Date().toISOString()

  const approval = db.chatApprovals.find(item => item.requestId === requestId && item.status === 'pending')
  if (approval) {
    approval.status = status
    approval.updatedAt = new Date().toISOString()
  }

  saveDb(db)
  return request
}

export async function sendMessage(requestId, senderRole, messageText) {
  const db = loadDb()
  const request = db.requests.find(item => item.id === requestId)

  if (!request) throw new Error('Request not found.')
  if (request.chatStatus !== 'approved') throw new Error('Chat is not approved by admin yet.')
  if (!messageText?.trim()) throw new Error('Message cannot be empty.')

  request.messages.push({
    id: makeId('message'),
    senderRole,
    messageText: messageText.trim(),
    createdAt: new Date().toISOString()
  })
  request.updatedAt = new Date().toISOString()

  saveDb(db)
  return request
}

export async function resetDatabase() {
  localStorage.setItem(DB_KEY, JSON.stringify(copy(EMPTY_DB)))
  return copy(EMPTY_DB)
}
