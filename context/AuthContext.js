// context/AuthContext.js - Updated
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Test credentials - ADMIN
        if (email === 'daqar12@gmail.com' && password === '123456') {
          const mockUser = {
            id: '1',
            name: 'Daqar Admin',
            email: email,
            role: 'admin',
            avatar: null,
            permissions: ['manage_cars', 'manage_bookings', 'manage_users', 'view_reports']
          }
          setUser(mockUser)
          localStorage.setItem('token', 'test-token-123')
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve({ user: mockUser, token: 'test-token-123' })
        }
        // Admin test
        else if (email === 'admin@driverent.com' && password === '123456') {
          const mockUser = {
            id: '2',
            name: 'Admin User',
            email: email,
            role: 'admin',
            avatar: null,
            permissions: ['manage_cars', 'manage_bookings', 'manage_users', 'view_reports']
          }
          setUser(mockUser)
          localStorage.setItem('token', 'test-token-admin')
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve({ user: mockUser, token: 'test-token-admin' })
        }
        // Regular user test
        else if (email === 'user@driverent.com' && password === '123456') {
          const mockUser = {
            id: '3',
            name: 'Regular User',
            email: email,
            role: 'user',
            avatar: null,
            permissions: ['view_bookings', 'create_bookings', 'cancel_bookings', 'make_payments']
          }
          setUser(mockUser)
          localStorage.setItem('token', 'test-token-user')
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve({ user: mockUser, token: 'test-token-user' })
        }
        // Any other email with 123456 password - creates a regular user
        else if (password === '123456') {
          const mockUser = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email: email,
            role: 'user',
            avatar: null,
            permissions: ['view_bookings', 'create_bookings', 'cancel_bookings', 'make_payments']
          }
          setUser(mockUser)
          localStorage.setItem('token', 'test-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve({ user: mockUser, token: 'test-token-' + Date.now() })
        }
        // Invalid credentials
        else {
          reject(new Error('Invalid email or password'))
        }
      }, 800)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const register = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: 'user', // All new registrations are regular users
          avatar: null,
          permissions: ['view_bookings', 'create_bookings', 'cancel_bookings', 'make_payments']
        }
        setUser(mockUser)
        localStorage.setItem('token', 'test-token-register-' + Date.now())
        localStorage.setItem('user', JSON.stringify(mockUser))
        resolve({ user: mockUser, token: 'test-token-register-' + Date.now() })
      }, 800)
    })
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}