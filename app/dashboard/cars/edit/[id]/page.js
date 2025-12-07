// app/dashboard/cars/edit/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  Car, 
  ArrowLeft,
  Save,
  Loader,
  Image as ImageIcon,
  Fuel,
  Settings,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react'

// Mock car data
const mockCars = [
  {
    id: 1,
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5 2023',
    year: 2023,
    pricePerDay: 129,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    status: 'available',
    mileage: '15,000',
    location: 'New York',
    description: 'Luxury SUV with premium features including panoramic sunroof, heated seats, and advanced safety systems.',
    features: 'GPS, Bluetooth, Sunroof, Heated Seats, Parking Sensors',
    image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5/10452/1762779994999/front-left-side-47.jpg'
  },
  {
    id: 2,
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3 2023',
    year: 2023,
    pricePerDay: 99,
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    status: 'available',
    mileage: '8,000',
    location: 'Boston',
    description: 'Fully electric sedan with autopilot, premium interior, and fast charging capability.',
    features: 'Autopilot, Premium Audio, Wireless Charging, Glass Roof',
    image: 'https://mobiwisy.fr/wp-content/uploads/Tesla-Model-3-Propulsion-RWD.jpg'
  },
  {
    id: 3,
    name: 'Mercedes E-Class',
    brand: 'Mercedes',
    model: 'E300 2023',
    year: 2023,
    pricePerDay: 149,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    status: 'maintenance',
    mileage: '12,000',
    location: 'Washington DC',
    description: 'Executive sedan with luxury interior, advanced driver assistance, and smooth ride.',
    features: 'Leather Seats, Ambient Lighting, Driver Assistance, Burmester Audio',
    image: 'https://www.stratstone.com/-/media/stratstone/mercedes-benz/new-cars/new-e-class/mercedes-benz-e-class-driving-720x405px.ashx?mh=1440&la=en&h=405&w=720&mw=2560&hash=EA2E6BA6B0A98222237AFEB03AA0531F'
  },
]

export default function EditCarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const carId = parseInt(params.id)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [featureInput, setFeatureInput] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchCar()
  }, [user, router, carId])

  const fetchCar = async () => {
  try {
    setLoading(true);
    const res = await fetch(`http://127.0.0.1:4000/api/cars/${carId}`);
    if (!res.ok) throw new Error("Car not found");
    const data = await res.json();
    setFormData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');
  setSuccess('');

  try {
    const res = await fetch(`http://127.0.0.1:4000/api/cars/${carId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to update car");
    const updatedCar = await res.json();
    setFormData(updatedCar);
    setSuccess("Car updated successfully!");
    setTimeout(() => router.push("/dashboard/cars"), 1500);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }



    // Simulate API call
    setTimeout(() => {
      console.log('Car updated:', formData)
      setSuccess('Car updated successfully!')
      setSaving(false)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/cars')
      }, 2000)
    }, 1500)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = formData.features ? formData.features.split(', ') : []
      const newFeatures = [...currentFeatures, featureInput.trim()]
      setFormData(prev => ({
        ...prev,
        features: newFeatures.join(', ')
      }))
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (featureToRemove) => {
    const currentFeatures = formData.features.split(', ').filter(f => f !== featureToRemove)
    setFormData(prev => ({
      ...prev,
      features: currentFeatures.join(', ')
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-0 lg:ml-64 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading car details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-0 lg:ml-64 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h2>
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/dashboard/cars')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Cars
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <AdminSidebar />
      
      <div className="ml-0 lg:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard/cars')}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 hover:scale-105 transition-transform"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Cars
            </button>
            
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Car className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Edit Car</h1>
                    <p className="text-blue-100 opacity-90">{formData.name} - {formData.brand} {formData.model}</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Editing Car ID: #{formData.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="space-y-8">
              
              {/* Image Preview & Upload */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Car Image
                </h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-4">Update car image</p>
                      <input
                        type="url"
                        name="image"
                        disabled
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/car-image.jpg"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="bg-gray-100 rounded-2xl overflow-hidden h-64">
                      <img
                        src={formData.image}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      disabled
                      required
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      disabled
                      required
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      disabled
                      required
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Fuel className="h-4 w-4 mr-1" />
                      Fuel Type *
                    </label>
                    <select
                      name="fuelType"
                      required
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission *
                    </label>
                    <select
                      name="transmission"
                      required
                      disabled
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Seats *
                    </label>
                    <input
                      type="number"
                      name="seats"
                      required
                      disabled
                      min="2"
                      max="8"
                      value={formData.seats}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Pricing
                </h2>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Day ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      min="0"
                      step="0.01"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a feature (e.g., GPS, Sunroof)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-3 rounded-xl transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.features && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.split(', ').map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(feature)}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the car features, condition, and special notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/cars')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Update Car</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium mb-1">Car Age</div>
              <div className="text-2xl font-bold text-gray-900">
                {new Date().getFullYear() - formData.year} years
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="text-sm text-green-600 font-medium mb-1">Daily Revenue Potential</div>
              <div className="text-2xl font-bold text-gray-900">
                ${formData.pricePerDay * 0.85}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium mb-1">Features Count</div>
              <div className="text-2xl font-bold text-gray-900">
                {formData.features ? formData.features.split(', ').length : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}