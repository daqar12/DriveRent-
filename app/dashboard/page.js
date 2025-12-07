// app/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  Users, 
  Car, 
  Calendar, 
  DollarSign,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    availableCars: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/users/login')
      return
    }
    
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalUsers: 1245,
          totalCars: 89,
          totalBookings: 342,
          totalRevenue: 65420,
          activeBookings: 28,
          availableCars: 67
        })
        
        setRecentBookings([
          { id: 1, user: 'John Doe', car: 'BMW X5', date: '2024-01-15', amount: 387, status: 'active' },
          { id: 2, user: 'Jane Smith', car: 'Tesla Model 3', date: '2024-01-14', amount: 297, status: 'completed' },
          { id: 3, user: 'Bob Johnson', car: 'Mercedes E-Class', date: '2024-01-13', amount: 447, status: 'active' },
          { id: 4, user: 'Alice Brown', car: 'Toyota Camry', date: '2024-01-12', amount: 177, status: 'pending' },
        ])
        
        setRecentUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', bookings: 3 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14', bookings: 1 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2024-01-13', bookings: 5 },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', joinDate: '2024-01-12', bookings: 2 },
        ])
        
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-500">+12%</span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Car className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-500">+5%</span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-500">+18%</span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-500">+24%</span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <BarChart3 className="text-blue-500 mr-1" size={16} />
                <span className="text-gray-600">Currently active</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableCars}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Car className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle className="text-green-500 mr-1" size={16} />
                <span className="text-green-500">Available now</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View all <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{booking.id.toString().padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.car}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                <Link href="/dashboard/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View all <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {user.bookings} bookings
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/cars/add"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <Car className="mb-3" size={28} />
                <div className="font-semibold text-lg mb-1">Add New Car</div>
                <div className="text-blue-100 text-sm">Add vehicles to your fleet</div>
              </div>
            </Link>
            <Link
              href="/dashboard/bookings"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <Calendar className="mb-3" size={28} />
                <div className="font-semibold text-lg mb-1">Manage Bookings</div>
                <div className="text-green-100 text-sm">View and manage all bookings</div>
              </div>
            </Link>
            <Link
              href="/dashboard/users"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <Users className="mb-3" size={28} />
                <div className="font-semibold text-lg mb-1">Manage Users</div>
                <div className="text-purple-100 text-sm">View and manage user accounts</div>
              </div>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <BarChart3 className="mb-3" size={28} />
                <div className="font-semibold text-lg mb-1">View Analytics</div>
                <div className="text-orange-100 text-sm">Detailed reports & insights</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}