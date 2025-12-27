'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  User,
  Car,
  CreditCard,
  Settings,
  LogOut,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'

export default function UserDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  // 🔐 Protect route
  useEffect(() => {
    if (!user) {
      router.push('/users/login')
    }
  }, [user, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'rentals':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              My Rentals
            </h3>

            <div className="text-center py-8">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No rentals yet</p>
              <button
                onClick={() => router.push('/cars')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Browse Cars
              </button>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Billing & Payments
            </h3>

            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment methods added</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Account
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your DriveRent account
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.role || 'user'}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'rentals', label: 'My Rentals', icon: Car },
                  { id: 'billing', label: 'Billing', icon: CreditCard },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
