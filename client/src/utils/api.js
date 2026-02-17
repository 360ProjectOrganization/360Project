// home of API calls for the backend
const API_BASE = '/api';

const AUTH_TOKEN_KEY = 'jobly_token';
const AUTH_USER_KEY = 'jobly_user';

// returns jwt string form local storage
export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function setAuthUser(user) {
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const config = { ...options, headers };
  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && token) clearToken();
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

// authentication API methods
export const authApi = {
  register: (payload) =>
    apiRequest('/auth/register', { method: 'POST', body: payload }),

  login: (payload) =>
    apiRequest('/auth/login', { method: 'POST', body: payload }),

  changePassword: (payload) =>
    apiRequest('/auth/changepassword', { method: 'PUT', body: payload }),

  changeEmail: (payload) =>
    apiRequest('/auth/changeemail', { method: 'PUT', body: payload }),
};

// applicant API methods
export const applicantApi = {
  getAll: () =>
    apiRequest(`/applicants/`),

  getById: (id) =>
    apiRequest(`/applicants/${id}`),

  deleteAccount: (id) =>
    apiRequest(`/applicants/${id}/delete`, { method: 'POST' }),

  getPfpUrl: (id) => `${API_BASE}/applicants/${id}/pfp`,

  // resume for download
  getResumeUrl: (id) => `${API_BASE}/applicants/${id}/resume`,

  // resume for viewing in browser
  getResumeViewUrl: (id) => `${API_BASE}/applicants/${id}/resume?inline=1`,

  uploadPfp: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest(`/applicants/${id}/pfp`, { method: 'PUT', body: form });
  },

  uploadResume: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest(`/applicants/${id}/resume`, { method: 'POST', body: form });
  },
};

// company API methods


// job postings API methods


// admin API methods



export default apiRequest;
