// services/bookingService.js
import http from './http'

export const bookingService = {
  getAllBookings: () => http.get('/bookings'),
  getBookingById: (id) => http.get(`/bookings/${id}`),
  createBooking: (data) => http.post('/bookings', data),
  updateBooking: (id, data) => http.put(`/bookings/${id}`, data),
  cancelBooking: (id) => http.delete(`/bookings/${id}`),
  getUserBookings: () => http.get('/bookings/my-bookings'),
}