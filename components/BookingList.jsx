// components/BookingList.jsx
export default function BookingList({ bookings }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500'
      case 'pending':
        return 'bg-amber-500'
      case 'completed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{booking.carName}</h3>
                <p className="text-gray-600">
                  {booking.startDate} to {booking.endDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">${booking.totalPrice}</div>
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  View Details
                </button>
                {booking.status === 'pending' && (
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}