// services/locationService.js
import http from './http'

export const locationService = {
  getAllLocations: () => http.get('/locations'),
  createLocation: (data) => http.post('/locations', data),
}