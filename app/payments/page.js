// app/payments/page.js - User Payments
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CreditCard, DollarSign, CheckCircle, Clock, AlertCircle, Download, Receipt } from 'lucide-react'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { formatPrice } from '@/utils/priceCalc'

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    // Simulate API call
    setTimeout(() => {
      setPayments([
        {
          id: '1',
          bookingId: 'DR-2024-00123',
          amount: 645,
          method: 'Credit Card',
          status: 'completed',
          date: '2024-01-15T14:30:00',
          transactionId: 'TX123456789'
        },
        {
          id: '2',
          bookingId: 'DR-2024-00124',
          amount: 198,
          method: 'PayPal',
          status: 'completed',
          date: '2024-01-10T11:20:00',
          transactionId: 'TX987654321'
        },
        {
          id: '3',
          bookingId: 'DR-2024-00127',
          amount: 138,
          method: 'Credit Card',
          status: 'refunded',
          date: '2024-01-14T13:30:00',
          transactionId: 'TX456789123'
        },
        {
          id: '4',
          bookingId: 'DR-2024-00128',
          amount: 795,
          method: 'Credit Card',
          status: 'pending',
          date: '2024-01-16T10:20:00',
          transactionId: 'TX789123456'
        },
      ])
      setLoading(false)
    }, 800)
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-8">You need to be signed in to view payments.</p>
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Payment History</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              View and manage your payment transactions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatPrice(payments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <div className="text-gray-600 font-medium">Total Spent</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-gray-600 font-medium">Completed Payments</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-gray-600 font-medium">Pending Payments</div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Payments</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{payment.bookingId}</div>
                        <div className="text-sm text-gray-600">
                          Transaction: {payment.transactionId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-sm text-gray-600">Amount</div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(payment.amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Payment Method</div>
                        <div className="font-medium">{payment.method}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Date</div>
                        <div className="font-medium">{formatDateTime(payment.date)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    {getStatusBadge(payment.status)}
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                      <Download size={18} />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-gray-600">Your payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}