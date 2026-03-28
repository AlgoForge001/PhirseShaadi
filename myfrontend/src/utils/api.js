import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// CHAT APIS
// ─────────────────────────────────────────────
export const getConversations = () => api.get('/chat/conversations');
export const getChatHistory = (userId) => api.get(`/chat/${userId}`);

// ─────────────────────────────────────────────
// PRIVACY & USER APIS
// ─────────────────────────────────────────────
export const updatePrivacySettings = (settings) => api.put('/privacy/settings', settings);
export const blockUser = (userId) => api.post('/user/block', { userId });
export const unblockUser = (userId) => api.delete(`/user/block/${userId}`);
export const getBlockedUsers = () => api.get('/user/blocked');
export const reportUser = (reportData) => api.post('/user/report', reportData);
export const getProfileViewers = () => api.get('/profile/viewers');

// ─────────────────────────────────────────────
// NOTIFICATION APIS
// ─────────────────────────────────────────────
export const getNotifications = () => api.get('/notifications');
export const markAllNotificationsRead = () => api.put('/notifications/read-all');
export const markNotificationRead = (id) => api.put(`/notifications/read/${id}`);

// ─────────────────────────────────────────────
// INTEREST APIS (Existing)
// ─────────────────────────────────────────────
export const sendInterest = (data) => api.post('/interest/send', data);
export const respondInterest = (data) => api.put('/interest/respond', data);
export const getReceivedInterests = () => api.get('/interest/received');
export const getSentInterests = () => api.get('/interest/sent');

export default api

