const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('autoria_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  }
};

// Cars API
export const carsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/cars${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getAvailable: async (startDate, endDate, location) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (location) params.append('location', location);
    
    const response = await fetch(`${API_BASE_URL}/cars/available?${params}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  create: async (carData) => {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(carData)
    });
    
    return handleResponse(response);
  },

  update: async (id, carData) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(carData)
    });
    
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  toggleAvailability: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    
    return handleResponse(response);
  },

  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  cancel: async (id, reason) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    
    return handleResponse(response);
  },

  // Admin endpoints
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/bookings${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  updateStatus: async (id, status, note) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    
    return handleResponse(response);
  },

  getStats: async (period = '30d') => {
    const response = await fetch(`${API_BASE_URL}/bookings/admin/stats?period=${period}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (period = '30d') => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard?period=${period}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getUserStats: async (period = '30d') => {
    const response = await fetch(`${API_BASE_URL}/admin/users/stats/overview?period=${period}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getSystemHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/health`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },

  updateSettings: async (settings) => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    return handleResponse(response);
  },

  getPerformanceData: async (period = '30d') => {
    const response = await fetch(`${API_BASE_URL}/admin/performance?period=${period}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(localStorage.getItem('autoria_token') && { 'Authorization': `Bearer ${localStorage.getItem('autoria_token')}` })
      },
      body: formData
    });
    
    return handleResponse(response);
  },

  deleteImage: async (filename) => {
    const response = await fetch(`${API_BASE_URL}/upload/image/${filename}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('autoria_token')}`
      }
    });
    
    return handleResponse(response);
  }
};