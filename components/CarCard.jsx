// components/CarCard.jsx
'use client'
import Link from 'next/link'
import { Users, Fuel, Settings, Star, Zap, Car as CarIcon } from 'lucide-react'
import { formatPrice } from '@/utils/priceCalc'

export default function CarCard({ car }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Car Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={car.images || '/placeholder.png'}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
          <Star className="text-yellow-500" size={16} fill="currentColor" />
          <span className="text-sm font-bold text-gray-900">{car.rating || '4.5'}</span>
        </div>
        
        {/* Fuel Type Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          {car.fuelType === 'Electric' ? (
            <div className="flex items-center space-x-1">
              <Zap size={12} />
              <span>Electric</span>
            </div>
          ) : car.fuelType}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Car Info Section */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {car.name}
              </h3>
              <p className="text-gray-500 text-sm">{car.brand} • {car.model}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(car.pricePerDay)}
              </p>
              <p className="text-gray-400 text-sm">per day</p>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
            <Users className="text-blue-600 mb-1" size={20} />
            <span className="text-sm font-medium text-gray-700">{car.seats}</span>
            <span className="text-xs text-gray-500">Seats</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-xl">
            <Fuel className="text-purple-600 mb-1" size={20} />
            <span className="text-sm font-medium text-gray-700">{car.fuelType}</span>
            <span className="text-xs text-gray-500">Fuel</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">
            <Settings className="text-green-600 mb-1" size={20} />
            <span className="text-sm font-medium text-gray-700">{car.transmission}</span>
            <span className="text-xs text-gray-500">Gear</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/cars/${car.id}`}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View Details
          </Link>
          <Link
            href={`/bookings/create?carId=${car.id}`}
            className="flex-1 border-2 border-blue-500 text-blue-500 text-center py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}