// context/BookingContext.js
'use client'
import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(undefined)

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    car: null,
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    totalPrice: 0
  })

  const updateBooking = (data) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const clearBooking = () => {
    setBookingData({
      car: null,
      pickupDate: '',
      dropoffDate: '',
      pickupLocation: '',
      dropoffLocation: '',
      totalPrice: 0
    })
  }

  const value = {
    bookingData,
    updateBooking,
    clearBooking
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  
  return context
}