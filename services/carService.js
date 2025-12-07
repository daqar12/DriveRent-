// services/carService.js
import http from './http'

export const carService = {
  // GET all cars
  getAllCars: () => http.get('/cars'),

  // GET single car
  getCarById: (id) => http.get(`/cars/${id}`),

  // CREATE car (with optional images)
  createCar: (data) => {
    // Haddii aad dirayso FormData (sawiro), axios si automatic u handle gareynaysa
    return http.post('/cars', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // UPDATE car (with optional images)
  updateCar: (id, data) => {
    return http.put(`/cars/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // DELETE car
  deleteCar: (id) => http.delete(`/cars/${id}`),

  // SEARCH cars (filters as query params)
  searchCars: (filters) => http.get('/cars/search', { params: filters }),
}
