// components/AdminSidebar.jsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  BarChart3 ,
  MessageSquare,
  UserCircle,
  Wallet 
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth() || {}

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/cars', icon: Car, label: 'Cars' },
    { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
    { href: '/dashboard/users', icon: Users, label: 'Users' },
    { href: '/dashboard/payment', icon: Wallet  , label: 'Payments' },
    { href: '/dashboard/masseges', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    // { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { href: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
  ]

  const handleLogout = () => {
    if (logout) {
      logout()
    }
  }

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold gradient-text">DriveRent Admin</h2>
      </div>
      
      <nav className="mt-2">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}