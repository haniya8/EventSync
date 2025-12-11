const API_BASE = 'http://localhost:3001/api';

export const api = {
  get: (url) => fetch(`${API_BASE}${url}`).then(r => r.json()),
  post: (url, data) => fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  put: (url, data) => fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  delete: (url) => fetch(`${API_BASE}${url}`, { method: 'DELETE' })
};