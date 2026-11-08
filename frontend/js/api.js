const API_BASE = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (payload) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    me: () => request('/auth/me'),
  },

  tools: {
    list: (filters = {}) => {
      const qs = new URLSearchParams(filters).toString();
      return request(`/tools${qs ? `?${qs}` : ''}`);
    },
    get: (id) => request(`/tools/${id}`),
    create: (payload) =>
      request('/tools', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`/tools/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => request(`/tools/${id}`, { method: 'DELETE' }),
  },

  bookings: {
    create: (payload) =>
      request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
    mine: () => request('/bookings/mine'),
    received: () => request('/bookings/received'),
    approve: (id) => request(`/bookings/${id}/approve`, { method: 'PUT' }),
    reject: (id) => request(`/bookings/${id}/reject`, { method: 'PUT' }),
  },

  reviews: {
    create: (payload) =>
      request('/reviews', { method: 'POST', body: JSON.stringify(payload) }),
  },
};

export async function mockTools() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Bosch Cordless Drill',
          category: 'Power Tools',
          suburb: 'Katlehong',
          depositFee: 5000,
          available: true,
          imageUrl: '',
        },
        {
          id: 2,
          name: 'Aluminium Extension Ladder',
          category: 'Ladders & Lifting',
          suburb: 'Thokoza',
          depositFee: 3000,
          available: true,
          imageUrl: '',
        },
        {
          id: 3,
          name: 'Petrol Lawnmower',
          category: 'Garden',
          suburb: 'Vosloorus',
          depositFee: 7500,
          available: false,
          imageUrl: '',
        },
        {
          id: 4,
          name: 'Pressure Washer',
          category: 'Cleaning',
          suburb: 'Alberton',
          depositFee: 6000,
          available: true,
          imageUrl: '',
        },
        {
          id: 5,
          name: 'Angle Grinder',
          category: 'Power Tools',
          suburb: 'Germiston',
          depositFee: 4000,
          available: true,
          imageUrl: '',
        },
        {
          id: 6,
          name: 'Garden Spade Set',
          category: 'Garden',
          suburb: 'Katlehong',
          depositFee: 1500,
          available: true,
          imageUrl: '',
        },
      ]);
    }, 400);
  });
}