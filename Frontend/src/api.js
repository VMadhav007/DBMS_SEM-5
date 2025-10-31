import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get user ID from localStorage
const getUserId = () => localStorage.getItem('userId');

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
};

// User APIs
export const userAPI = {
  getProfile: (userId) => api.get(`/user/profile/${userId}`),
  getMembershipPlans: () => api.get('/user/membership-plans'),
  getCoupons: () => api.get('/user/coupons'),
  purchaseMembership: (userId, data) => api.post(`/user/purchase-membership/${userId}`, data),
  getMyMemberships: (userId) => api.get(`/user/my-memberships/${userId}`),
  getSessions: () => api.get('/user/sessions'),
  bookSession: (userId, data) => api.post(`/user/book-session/${userId}`, data),
  getMyBookings: (userId) => api.get(`/user/my-bookings/${userId}`),
  cancelBooking: (bookingId) => api.put(`/user/cancel-booking/${bookingId}`),
  checkin: (userId, data) => api.post(`/user/checkin/${userId}`, data),
  getMyPayments: (userId) => api.get(`/user/my-payments/${userId}`),
};

// Admin APIs
export const adminAPI = {
  // Branches
  getBranches: () => api.get('/admin/branches'),
  createBranch: (data) => api.post('/admin/branches', data),
  updateBranch: (id, data) => api.put(`/admin/branches/${id}`, data),
  deleteBranch: (id) => api.delete(`/admin/branches/${id}`),
  
  // Studios
  getStudios: () => api.get('/admin/studios'),
  createStudio: (data) => api.post('/admin/studios', data),
  
  // Activity Types
  getActivityTypes: () => api.get('/admin/activity-types'),
  createActivityType: (data) => api.post('/admin/activity-types', data),
  
  // Sessions
  getSessions: () => api.get('/admin/sessions'),
  createSession: (data) => api.post('/admin/sessions', data),
  deleteSession: (id) => api.delete(`/admin/sessions/${id}`),
  
  // Membership Plans
  createMembershipPlan: (data) => api.post('/admin/membership-plans', data),
  
  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  
  // Reports
  getRevenueReport: () => api.get('/admin/reports/revenue'),
  getUserActivityReport: () => api.get('/admin/reports/user-activity'),
  getPopularSessions: () => api.get('/admin/reports/popular-sessions'),
  getActiveMembers: () => api.get('/admin/reports/active-members'),
  getTopBranch: () => api.get('/admin/reports/top-performing-branch'),
};

export default api;
