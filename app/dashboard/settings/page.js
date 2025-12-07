// app/dashboard/settings/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  Save, 
  Bell, 
  Shield, 
  CreditCard, 
  Mail, 
  Globe,
  Check,
  X
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    bookingNotifications: true,
    promotionNotifications: false,
    newsletter: true,
    
    // Privacy
    showProfile: true,
    shareAnalytics: true,
    twoFactorAuth: false,
    
    // Payment
    autoRenew: true,
    savePayment: true,
    currency: 'USD',
    
    // General
    language: 'en',
    timezone: 'UTC',
    theme: 'light'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
  }, [user, router])

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, save to backend
    console.log('Saving settings:', settings)
    
    setIsSaving(false)
    setSaveMessage('Settings saved successfully!')
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive email updates about bookings and system alerts',
          type: 'toggle'
        },
        {
          key: 'bookingNotifications',
          label: 'Booking Notifications',
          description: 'Get notified about new bookings and cancellations',
          type: 'toggle'
        },
        {
          key: 'promotionNotifications',
          label: 'Promotion Notifications',
          description: 'Receive updates about special promotions and discounts',
          type: 'toggle'
        },
        {
          key: 'newsletter',
          label: 'Monthly Newsletter',
          description: 'Subscribe to our monthly newsletter with insights',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          key: 'showProfile',
          label: 'Show Profile',
          description: 'Allow other users to see your profile information',
          type: 'toggle'
        },
        {
          key: 'shareAnalytics',
          label: 'Share Analytics',
          description: 'Help us improve by sharing anonymous usage data',
          type: 'toggle'
        },
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Payment & Billing',
      icon: CreditCard,
      settings: [
        {
          key: 'autoRenew',
          label: 'Auto Renew Subscription',
          description: 'Automatically renew your subscription',
          type: 'toggle'
        },
        {
          key: 'savePayment',
          label: 'Save Payment Methods',
          description: 'Save payment methods for faster checkout',
          type: 'toggle'
        },
        {
          key: 'currency',
          label: 'Preferred Currency',
          description: 'Choose your default currency',
          type: 'select',
          options: [
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
            { value: 'CAD', label: 'Canadian Dollar (CAD)' }
          ]
        }
      ]
    },
    {
      title: 'General',
      icon: Globe,
      settings: [
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ]
        },
        {
          key: 'timezone',
          label: 'Timezone',
          description: 'Set your local timezone',
          type: 'select',
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
            { value: 'CET', label: 'Central European Time' }
          ]
        },
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' }
          ]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {saveMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <Check className="text-green-500 w-5 h-5 mr-2" />
              <span className="text-green-700">{saveMessage}</span>
            </div>
          )}

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <section.icon className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{setting.label}</h3>
                        <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      </div>
                      
                      <div className="ml-4">
                        {setting.type === 'toggle' ? (
                          <button
                            onClick={() => handleSettingChange(section.title, setting.key, !settings[setting.key])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings[setting.key] ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        ) : setting.type === 'select' ? (
                          <select
                            value={settings[setting.key]}
                            onChange={(e) => handleSettingChange(section.title, setting.key, e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {setting.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Account Actions */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}