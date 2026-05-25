const DB_KEY = 'servicehub_database'

const EMPTY_DB = {
  accounts: [],
  requests: [],
  chatApprovals: []
}

function loadDb() {
  const saved = localStorage.getItem(DB_KEY)
  return saved ? JSON.parse(saved) : structuredClone(EMPTY_DB)
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  return db
}

function makeId() {
  return Date.now().toString() + Math.random().toString(16).slice(2)
}

export async function getDatabaseSnapshot() {
  return loadDb()
}

export async function createAccount(accountData) {
  const db = loadDb()

  const account = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    ...accountData
  }

  if (account.role === 'provider') {
    account.status = 'pending-admin-approval'
    account.providerId = `PROV-${Math.floor(Math.random() * 99999)}`
  } else {
    account.status = 'active'
  }

  db.accounts.push(account)

  saveDb(db)
  return account
}

export async function googleCreateAccount(accountData) {
  return createAccount({
    ...accountData,
    accountMethod: 'google'
  })
}

export async function signInAccount({
  role,
  identifier,
  password
}) {
  const db = loadDb()

  if (role === 'admin') {
    if (
      identifier === 'admin01' &&
      password === 'admin123'
    ) {
      return {
        id: 'admin01',
        role: 'admin',
        name: 'ServiceHub Admin',
        status: 'active'
      }
    }

    throw new Error('Invalid admin credentials.')
  }

  const account = db.accounts.find(item => {
    if (role === 'customer') {
      return (
        item.role === 'customer' &&
        item.name.toLowerCase() === identifier.toLowerCase() &&
        item.password === password
      )
    }

    return (
      item.role === 'provider' &&
      item.providerId === identifier &&
      item.password === password
    )
  })

  if (!account) {
    throw new Error('No matching account found.')
  }

  if (
    role === 'provider' &&
    account.status !== 'approved'
  ) {
    throw new Error('Provider account waiting for admin approval.')
  }

  return account
}

export async function updateAccountStatus(accountId, status) {
  const db = loadDb()

  const account = db.accounts.find(item => item.id === accountId)

  if (account) {
    account.status = status
  }

  saveDb(db)
  return account
}

export async function createServiceRequest(requestData) {
  const db = loadDb()

  const request = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    status: 'pending-admin-review',
    providerStatus: 'waiting',
    chatStatus: 'not-approved',
    assignedProviderId: '',
    messages: [],
    ...requestData
  }

  db.requests.push(request)

  saveDb(db)
  return request
}

export async function adminAssignRequest(requestId, providerId) {
  const db = loadDb()

  const request = db.requests.find(item => item.id === requestId)

  if (request) {
    request.assignedProviderId = providerId
    request.status = 'assigned'
  }

  saveDb(db)
  return request
}

export async function providerRespondToRequest(requestId, status) {
  const db = loadDb()

  const request = db.requests.find(item => item.id === requestId)

  if (request) {
    request.providerStatus = status

    if (status === 'accepted') {
      request.status = 'active'
    }

    if (status === 'declined') {
      request.status = 'declined'
    }
  }

  saveDb(db)
  return request
}

export async function requestChatApproval(requestId, requestedBy) {
  const db = loadDb()

  db.chatApprovals.push({
    id: makeId(),
    requestId,
    requestedBy,
    status: 'pending'
  })

  saveDb(db)
}

export async function adminSetChatApproval(requestId, status) {
  const db = loadDb()

  const request = db.requests.find(item => item.id === requestId)

  if (request) {
    request.chatStatus = status
  }

  saveDb(db)
}

export async function sendMessage(
  requestId,
  senderRole,
  messageText
) {
  const db = loadDb()

  const request = db.requests.find(item => item.id === requestId)

  if (!request) {
    throw new Error('Request not found.')
  }

  if (request.chatStatus !== 'approved') {
    throw new Error('Chat is not approved.')
  }

  request.messages.push({
    id: makeId(),
    senderRole,
    messageText,
    createdAt: new Date().toISOString()
  })

  saveDb(db)
}

export async function resetDatabase() {
  localStorage.removeItem(DB_KEY)
  return structuredClone(EMPTY_DB)
}
