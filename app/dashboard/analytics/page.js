// app/dashboard/analytics/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  BarChart3, 
  TrendingUp, 
  Car, 
  Users, 
  Calendar, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('month')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    
    // Mock data - replace with actual API call
    const mockData = {
      revenue: {
        current: 42800,
        previous: 35200,
        change: 21.6
      },
      bookings: {
        current: 156,
        previous: 128,
        change: 21.9
      },
      carsRented: {
        current: 42,
        previous: 35,
        change: 20.0
      },
      newUsers: {
        current: 28,
        previous: 22,
        change: 27.3
      },
      popularCars: [
        { name: 'Tesla Model 3', bookings: 45, revenue: 13500 },
        { name: 'BMW X5', bookings: 32, revenue: 9600 },
        { name: 'Toyota Camry', bookings: 28, revenue: 5600 },
        { name: 'Mercedes C-Class', bookings: 25, revenue: 7500 },
      ],
      bookingTrends: [
        { month: 'Jan', bookings: 120 },
        { month: 'Feb', bookings: 135 },
        { month: 'Mar', bookings: 145 },
        { month: 'Apr', bookings: 156 },
        { month: 'May', bookings: 165 },
        { month: 'Jun', bookings: 178 },
      ],
      userGrowth: [
        { month: 'Jan', users: 450 },
        { month: 'Feb', users: 520 },
        { month: 'Mar', users: 580 },
        { month: 'Apr', users: 610 },
        { month: 'May', users: 670 },
        { month: 'Jun', users: 720 },
      ]
    }
    setAnalyticsData(mockData)
  }, [timeRange, user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${analyticsData?.revenue.current.toLocaleString()}`,
      change: analyticsData?.revenue.change,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Bookings',
      value: analyticsData?.bookings.current,
      change: analyticsData?.bookings.change,
      icon: Calendar,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Cars Rented',
      value: analyticsData?.carsRented.current,
      change: analyticsData?.carsRented.change,
      icon: Car,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      title: 'New Users',
      value: analyticsData?.newUsers.current,
      change: analyticsData?.newUsers.change,
      icon: Users,
      color: 'bg-orange-500',
      trend: 'up'
    }
  ]

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-0 lg:ml-64 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your business performance and insights</p>
            </div>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUp className="text-green-500 w-4 h-4" />
                      ) : (
                        <ArrowDown className="text-red-500 w-4 h-4" />
                      )}
                      <span className={`ml-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}% from last period
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Popular Cars */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Most Popular Cars</h3>
              <div className="space-y-4">
                {analyticsData.popularCars.map((car, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{car.name}</p>
                      <p className="text-sm text-gray-500">{car.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${car.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
              <div className="space-y-3">
                {analyticsData.bookingTrends.map((trend, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{trend.month}</span>
                      <span className="text-sm font-medium">{trend.bookings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(trend.bookings / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">User Growth</h3>
              <TrendingUp className="text-green-500 w-5 h-5" />
            </div>
            <div className="flex items-end h-48 space-x-2">
              {analyticsData.userGrowth.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(data.users / 800) * 100}%` }}
                    title={`${data.month}: ${data.users} users`}
                  />
                  <span className="mt-2 text-sm text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}