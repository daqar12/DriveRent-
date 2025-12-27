'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API = 'http://localhost:4000/api/auth'

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    const storedToken = sessionStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser({ ...JSON.parse(storedUser), token: storedToken })
    }
    setLoading(false)
  }, [])

  const register = async (email, password, name, phone) => {
    const res = await axios.post(`${API}/register`, { name, email, phone, password })
    return res.data
  }

  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password })
    
    // Save user and token in sessionStorage
    sessionStorage.setItem('token', res.data.token)
    sessionStorage.setItem('user', JSON.stringify(res.data.user))

    setUser({ ...res.data.user, token: res.data.token })
    return res.data
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
