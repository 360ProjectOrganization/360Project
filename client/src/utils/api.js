// home of API calls for the backend
const API_BASE = '/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
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
};

// company API methods


// job postings API methods


// admin API methods



export default apiRequest;
