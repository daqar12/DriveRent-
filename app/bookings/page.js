// app/bookings/page.js
'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { bookingService } from '@/services/bookingService'
import { useAuth } from '@/context/AuthContext'
import { Calendar, Car, MapPin, Clock, CreditCard, Download, Filter, CheckCircle, XCircle, Clock as ClockIcon, Search } from 'lucide-react'
import { formatDateTime, formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/priceCalc'

export default function BookingsPage() {
  const { user } = useAuth() || {}
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'upcoming', 'past', 'cancelled'
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
  try {
    setLoading(true)
    const response = await fetch('http://127.0.0.1:4000/api/booking')
    if (!response.ok) throw new Error('Failed to fetch bookings')
    const data = await response.json()

    // Map API data to your front-end format if needed
    const formattedBookings = data.map(b => ({
      id: b._id,
      bookingId: b.bookingId || `DR-${b._id}`,
      carId: b.car_id?._id || b.car_id,
      carName: b.car_name || b.car_id?.name,
      carImage: b.car_image || `/cars/${b.car_id?.model || 'default-car'}.jpg`,
      pickupDate: b.start_date,
      dropoffDate: b.end_date,
      pickupLocation: b.pickup_location,
      dropoffLocation: b.return_location,
      totalPrice: b.total_price,
      status: b.status,
      paymentStatus: b.payment_status,
      createdAt: b.created_at
    }))

    setBookings(formattedBookings)
    setFilteredBookings(formattedBookings)
    setLoading(false)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    setBookings([])
    setFilteredBookings([])
    setLoading(false)
  }
}


  useEffect(() => {
    let result = [...bookings]

    // Apply status filter
    if (activeTab !== 'all') {
      result = result.filter(booking => {
        if (activeTab === 'upcoming') return booking.status === 'confirmed'
        if (activeTab === 'past') return booking.status === 'completed'
        if (activeTab === 'cancelled') return booking.status === 'cancelled'
        return true
      })
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(booking =>
        booking.carName.toLowerCase().includes(term) ||
        booking.bookingId.toLowerCase().includes(term) ||
        booking.pickupLocation.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    result = sortBookings(result, sortBy)
    setFilteredBookings(result)
  }, [bookings, activeTab, searchTerm, sortBy])

  const sortBookings = (bookingsList, sortOption) => {
    const sorted = [...bookingsList]
    switch(sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate))
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate))
      case 'price-desc':
        return sorted.sort((a, b) => b.totalPrice - a.totalPrice)
      case 'price-asc':
        return sorted.sort((a, b) => a.totalPrice - b.totalPrice)
      default:
        return sorted
    }
  }

  const getMockBookings = () => [
    {
      id: '1',
      bookingId: 'DR-2024-00123',
      carId: '1',
      carName: 'BMW X5',
      carImage: '/cars/bmw-x5.jpg',
      pickupDate: '2024-01-20T10:00:00',
      dropoffDate: '2024-01-25T10:00:00',
      pickupLocation: 'New York Downtown',
      dropoffLocation: 'New York Airport',
      totalPrice: 645,
      status: 'confirmed', // confirmed, completed, cancelled
      paymentStatus: 'paid',
      createdAt: '2024-01-15T14:30:00'
    },
    {
      id: '2',
      bookingId: 'DR-2024-00124',
      carId: '2',
      carName: 'Tesla Model 3',
      carImage: '/cars/tesla-model3.jpg',
      pickupDate: '2024-01-18T09:00:00',
      dropoffDate: '2024-01-19T17:00:00',
      pickupLocation: 'Boston Center',
      dropoffLocation: 'Boston Center',
      totalPrice: 198,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2024-01-10T11:20:00'
    },
    {
      id: '3',
      bookingId: 'DR-2024-00125',
      carId: '3',
      carName: 'Mercedes E-Class',
      carImage: '/cars/mercedes-eclass.jpg',
      pickupDate: '2024-02-01T14:00:00',
      dropoffDate: '2024-02-05T14:00:00',
      pickupLocation: 'Washington DC',
      dropoffLocation: 'Washington DC',
      totalPrice: 596,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-12T16:45:00'
    },
    {
      id: '4',
      bookingId: 'DR-2024-00126',
      carId: '4',
      carName: 'Toyota Camry',
      carImage: '/cars/toyota-camry.jpg',
      pickupDate: '2024-01-05T08:00:00',
      dropoffDate: '2024-01-10T08:00:00',
      pickupLocation: 'New York Airport',
      dropoffLocation: 'New York Downtown',
      totalPrice: 295,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2023-12-28T09:15:00'
    },
    {
      id: '5',
      bookingId: 'DR-2024-00127',
      carId: '5',
      carName: 'Honda CR-V',
      carImage: '/cars/honda-crv.jpg',
      pickupDate: '2024-01-22T11:00:00',
      dropoffDate: '2024-01-24T11:00:00',
      pickupLocation: 'Boston Center',
      dropoffLocation: 'Boston Center',
      totalPrice: 138,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-14T13:30:00'
    },
    {
      id: '6',
      bookingId: 'DR-2024-00128',
      carId: '6',
      carName: 'Audi Q7',
      carImage: '/cars/audi-q7.jpg',
      pickupDate: '2024-02-10T15:00:00',
      dropoffDate: '2024-02-15T15:00:00',
      pickupLocation: 'New York Downtown',
      dropoffLocation: 'New York Downtown',
      totalPrice: 795,
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: '2024-01-16T10:20:00'
    },
  ]

  const getStatusBadge = (status, paymentStatus) => {
    switch(status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle size={14} className="mr-1" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={14} className="mr-1" />
            Pending
          </span>
        )
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Paid
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={12} className="mr-1" />
            Pending
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CreditCard size={12} className="mr-1" />
            Refunded
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        )
    }
  }

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      // In real app, call API to cancel booking
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' }
          : booking
      ))
    }
  }

  const handleDownloadInvoice = (bookingId) => {
    // Simulate download
    alert(`Downloading invoice for booking ${bookingId}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-8">You need to be signed in to view your bookings.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">My Bookings</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Manage your reservations, view details, and track your rental history
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-gray-600 font-medium">Upcoming Bookings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-gray-600 font-medium">Completed Trips</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Total Spent</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {bookings.length}
            </div>
            <div className="text-gray-600 font-medium">All Reservations</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Reservations
              </h2>
              <p className="text-gray-600">Filter and manage your bookings</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({bookings.filter(b => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past Trips ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-lg font-bold text-gray-900">{booking.bookingId}</span>
                        {getStatusBadge(booking.status, booking.paymentStatus)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booked on {formatDateTime(booking.createdAt)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(booking.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                    </div>
                  </div>

                  {/* Car Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={booking.carImage}
                            alt={booking.carName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.carName}</h3>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <Car size={16} />
                            <span>Premium SUV</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Pickup</div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-blue-500" />
                          <span className="font-medium">{formatDate(booking.pickupDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <MapPin size={14} />
                          <span>{booking.pickupLocation}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Drop-off</div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-blue-500" />
                          <span className="font-medium">{formatDate(booking.dropoffDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <MapPin size={14} />
                          <span>{booking.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleDownloadInvoice(booking.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download size={18} />
                      <span>Download Invoice</span>
                    </button>
                    
                    <a
                      href={`/cars/${booking.carId}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Car size={18} />
                      <span>View Car Details</span>
                    </a>
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle size={18} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                    
                    <a
                      href={`/bookings/${booking.id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      <Clock size={18} />
                      <span>View Details</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6">
                <Calendar className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet. Ready to rent your dream car?"
                  : `You don't have any ${activeTab} bookings.`
                }
              </p>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium mr-4"
                >
                  View All Bookings
                </button>
              )}
              <a
                href="/cars"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Browse Cars
              </a>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Rental Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-gray-700 font-medium">Trips Completed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0) / 1000)}K
              </div>
              <div className="text-gray-700 font-medium">Total Spent</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(bookings.map(b => b.carId)).size}
              </div>
              <div className="text-gray-700 font-medium">Different Cars Rented</div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}