const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const ADMIN_PREFIX = '/api/v1/admin'

const ENDPOINTS = {
  stats: `${ADMIN_PREFIX}/dashboard/stats`,
  messages: `${ADMIN_PREFIX}/messages`,
  projects: `${ADMIN_PREFIX}/projects`,
  skills: `${ADMIN_PREFIX}/skills`,
  services: `${ADMIN_PREFIX}/services`,
  experiences: `${ADMIN_PREFIX}/experiences`,
  profile: `${ADMIN_PREFIX}/profile`,
  settings: `${ADMIN_PREFIX}/settings`,
}

function getAuthToken() {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') || ''
}

export function setAuthToken(token, persist = false) {
  if (!token) {
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_token')
    return
  }
  if (persist) localStorage.setItem('admin_token', token)
  else sessionStorage.setItem('admin_token', token)
}

async function request(path, options = {}) {
  const token = getAuthToken()
  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  let data = null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try { data = await res.json() } catch { data = null }
  } else if (res.status !== 204) {
    try { data = await res.text() } catch { data = null }
  }

  if (!res.ok) {
    const error = new Error(data?.detail || data?.message || `Request failed (${res.status})`)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

export const adminApi = {
  endpoints: ENDPOINTS,
  getStats: () => request(ENDPOINTS.stats),
  getMessages: (params = {}) => request(`${ENDPOINTS.messages}${toQuery(params)}`),
  getMessage: (id) => request(`${ENDPOINTS.messages}/${id}`),
  updateMessageStatus: (id, status) => request(`${ENDPOINTS.messages}/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteMessage: (id) => request(`${ENDPOINTS.messages}/${id}`, { method: 'DELETE' }),
  getProjects: () => request(ENDPOINTS.projects),
  createProject: (payload) => request(ENDPOINTS.projects, { method: 'POST', body: toBody(payload) }),
  updateProject: (id, payload) => request(`${ENDPOINTS.projects}/${id}`, { method: 'PUT', body: toBody(payload) }),
  deleteProject: (id) => request(`${ENDPOINTS.projects}/${id}`, { method: 'DELETE' }),
  getSkills: () => request(ENDPOINTS.skills),
  createSkill: (payload) => request(ENDPOINTS.skills, { method: 'POST', body: toBody(payload) }),
  updateSkill: (id, payload) => request(`${ENDPOINTS.skills}/${id}`, { method: 'PUT', body: toBody(payload) }),
  deleteSkill: (id) => request(`${ENDPOINTS.skills}/${id}`, { method: 'DELETE' }),
  getServices: () => request(ENDPOINTS.services),
  createService: (payload) => request(ENDPOINTS.services, { method: 'POST', body: toBody(payload) }),
  updateService: (id, payload) => request(`${ENDPOINTS.services}/${id}`, { method: 'PUT', body: toBody(payload) }),
  deleteService: (id) => request(`${ENDPOINTS.services}/${id}`, { method: 'DELETE' }),
  getExperiences: () => request(ENDPOINTS.experiences),
  createExperience: (payload) => request(ENDPOINTS.experiences, { method: 'POST', body: toBody(payload) }),
  updateExperience: (id, payload) => request(`${ENDPOINTS.experiences}/${id}`, { method: 'PUT', body: toBody(payload) }),
  deleteExperience: (id) => request(`${ENDPOINTS.experiences}/${id}`, { method: 'DELETE' }),
  getProfile: () => request(ENDPOINTS.profile),
  updateProfile: (payload) => request(ENDPOINTS.profile, { method: 'PUT', body: toBody(payload) }),
  changePassword: (payload) => request(`${ENDPOINTS.profile}/password`, { method: 'PUT', body: toBody(payload) }),
  getSettings: () => request(ENDPOINTS.settings),
  updateSettings: (payload) => request(ENDPOINTS.settings, { method: 'PUT', body: toBody(payload) }),
  verifySession: () => request(`${ADMIN_PREFIX}/auth/me`),
}

function toQuery(params) {
  const entries = Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (!entries.length) return ''
  const q = new URLSearchParams(entries)
  return `?${q.toString()}`
}

function toBody(payload) {
  if (payload instanceof FormData) return payload
  return JSON.stringify(payload)
}

export function isUnauthorizedError(err) {
  return err?.status === 401 || err?.status === 403
}

export function formatApiError(err) {
  if (!err) return 'Unknown error'
  if (err.status === 401) return 'Unauthorized. Please sign in again.'
  if (err.status === 403) return 'Access denied. Admin authorization required.'
  if (err.status === 404) return 'Requested resource was not found.'
  if (err.status >= 500) return 'Server error. Please try again later.'
  return err.message || 'Request failed.'
}
