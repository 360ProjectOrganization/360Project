// home of API calls for the backend
const API_BASE = '/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const config = {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  };
  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}


// authentication API methods
// register applicant or company


// applicant API methods
export const applicantApi = {
  getAll: () =>
    apiRequest(`/applicants/`),

  getById: (id) =>
    apiRequest(`/applicants/${id}`),
  
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
