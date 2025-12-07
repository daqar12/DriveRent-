// app/bookings/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { bookingService } from '@/services/bookingService'
import { useAuth } from '@/context/AuthContext'
import { Calendar, Car, MapPin, CreditCard, Download, Phone, Mail, User, Shield, CheckCircle } from 'lucide-react'
import { formatDateTime, formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/priceCalc'

export default function BookingDetailsPage() {
  const params = useParams()
  const { user } = useAuth() || {}
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookingDetails()
    }
  }, [params.id, user])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockBooking = {
          id: params.id,
          bookingId: 'DR-2024-00123',
          carName: 'BMW X5',
          carModel: 'X5 2023',
          carImage: '/cars/bmw-x5.jpg',
          carDetails: {
            seats: 5,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            color: 'Black',
            licensePlate: 'NYC-7890'
          },
          pickupDate: '2024-01-20T10:00:00',
          dropoffDate: '2024-01-25T10:00:00',
          pickupLocation: 'New York Downtown',
          dropoffLocation: 'New York Airport',
          totalPrice: 645,
          basePrice: 600,
          taxes: 45,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T14:30:00',
          user: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            licenseNumber: 'DL123456789'
          },
          insurance: 'Full Coverage',
          specialRequests: 'Need child seat',
          pickupInstructions: 'Look for DriveRent representative at main entrance'
        }
        setBooking(mockBooking)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-8">You need to be signed in to view booking details.</p>
            <a
              href="/users/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-8">The booking you're looking for doesn't exist.</p>
            <a
              href="/bookings"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Bookings
            </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Booking Details</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Reference: <span className="font-bold">{booking.bookingId}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Car Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Car Information</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle size={14} className="inline mr-1" />
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={booking.carImage}
                      alt={booking.carName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.carName}</h3>
                  <p className="text-gray-600 mb-4">{booking.carModel}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Seats</div>
                      <div className="text-lg font-bold text-gray-900">{booking.carDetails.seats}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Fuel Type</div>
                      <div className="text-lg font-bold text-gray-900">{booking.carDetails.fuelType}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Transmission</div>
                      <div className="text-lg font-bold text-gray-900">{booking.carDetails.transmission}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Color</div>
                      <div className="text-lg font-bold text-gray-900">{booking.carDetails.color}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">License Plate</div>
                    <div className="text-lg font-bold text-gray-900">{booking.carDetails.licensePlate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Period Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental Period</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Pickup Date & Time</div>
                      <div className="text-lg font-bold text-gray-900">{formatDateTime(booking.pickupDate)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MapPin className="text-green-600" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Pickup Location</div>
                      <div className="text-lg font-bold text-gray-900">{booking.pickupLocation}</div>
                      {booking.pickupInstructions && (
                        <div className="text-sm text-gray-600 mt-1">{booking.pickupInstructions}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Drop-off Date & Time</div>
                      <div className="text-lg font-bold text-gray-900">{formatDateTime(booking.dropoffDate)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MapPin className="text-green-600" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Drop-off Location</div>
                      <div className="text-lg font-bold text-gray-900">{booking.dropoffLocation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Requests</h2>
                <p className="text-gray-700">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">{formatPrice(booking.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">{formatPrice(booking.taxes)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <CreditCard size={18} />
                  <span>Payment Method: {booking.paymentMethod}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={18} />
                  <span className="font-medium">Payment {booking.paymentStatus}</span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <div className="text-sm text-gray-600">Full Name</div>
                    <div className="font-medium">{booking.user.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="text-gray-400 mt-1" size={18} />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{booking.user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{booking.user.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="text-gray-400 mt-1" size={18} />
                  <div>
                    <div className="text-sm text-gray-600">Driver's License</div>
                    <div className="font-medium">{booking.user.licenseNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h3 className="text-lg font-bold text-gray-900">Insurance Coverage</h3>
              </div>
              <p className="text-gray-700 mb-4">{booking.insurance}</p>
              <div className="text-sm text-gray-600">
                Full coverage includes collision damage waiver and liability protection
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold">
                <Download size={20} />
                <span>Download Receipt</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                <Phone size={20} />
                <span>Contact Support</span>
              </button>
              
              {booking.status === 'confirmed' && (
                <button className="w-full flex items-center justify-center space-x-2 bg-red-100 text-red-700 py-3 rounded-xl hover:bg-red-200 transition-colors font-medium">
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}