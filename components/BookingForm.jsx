'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { calculateTotalPrice, formatPrice } from '@/utils/priceCalc'

export default function BookingForm({ car }) {
  const router = useRouter()
  const { user } = useAuth()
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

    const payload = {
      carId: car.id,
      userId: user.id,
      ...formData,
      totalPrice
    }

    try {
      const res = await fetch('http://localhost:4000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')

      alert('Booking successful!')
      router.push('/dashboard/bookings')
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Book: {car.name}</h2>
      <p className="mb-4 text-gray-600">{car.brand} • {car.model} • {car.year}</p>
      <p className="mb-4 font-semibold">Price per day: {formatPrice(car.pricePerDay)}</p>
      <p className="mb-6 font-bold">Total Price: {formatPrice(totalPrice)}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Pickup Date</label>
          <input
            type="date"
            value={formData.pickupDate}
            onChange={e => handleChange('pickupDate', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Dropoff Date</label>
          <input
            type="date"
            value={formData.dropoffDate}
            onChange={e => handleChange('dropoffDate', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pickup Location</label>
          <input
            type="text"
            value={formData.pickupLocation}
            onChange={e => handleChange('pickupLocation', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Dropoff Location</label>
          <input
            type="text"
            value={formData.dropoffLocation}
            onChange={e => handleChange('dropoffLocation', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Special Requests</label>
          <textarea
            value={formData.specialRequests}
            onChange={e => handleChange('specialRequests', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  )
}
