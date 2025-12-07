// services/userService.js
import http from './http'

export const userService = {
  login: (email, password) => http.post('/auth/login', { email, password }),
  register: (userData) => http.post('/auth/register', userData),
  getProfile: () => http.get('/auth/profile'),
  updateProfile: (data) => http.put('/auth/profile', data),
  getAllUsers: () => http.get('/users'),
  updateUser: (id, data) => http.put(`/users/${id}`, data),
  deleteUser: (id) => http.delete(`/users/${id}`),
}