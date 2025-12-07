// services/paymentService.js
import http from './http'

export const paymentService = {
  createPayment: (data) => http.post('/payments', data),
  getPayment: (id) => http.get(`/payments/${id}`),
}