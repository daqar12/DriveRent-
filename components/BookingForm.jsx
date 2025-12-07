// components/BookingForm.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { calculateTotalPrice, formatPrice } from '@/utils/priceCalc'
import { Calendar, MapPin, CreditCard } from 'lucide-react'

export default function BookingForm({ car }) {
  const router = useRouter()
  const { user } = useAuth() || {}
  const { updateBooking } = useBooking() || {}
  
  const [formData, setFormData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: ''
  })

  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (formData.pickupDate && formData.dropoffDate && car) {
      const price = calculateTotalPrice(
        car.pricePerDay,
        formData.pickupDate,
        formData.dropoffDate
      )
      setTotalPrice(price)
    }
  }, [formData.pickupDate, formData.dropoffDate, car])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/users/login')
      return
    }

    // Update booking context
    if (updateBooking) {
      updateBooking({
        car,
        ...formData,
        totalPrice
      })
    }

    // Redirect to payment
    router.push('/payments')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Book This Car</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rest of the component remains the same */}
        {/* ... */}
      </form>
    </div>
  )
}