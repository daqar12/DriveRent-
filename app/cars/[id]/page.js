// app/cars/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'
import { carService } from '@/services/carService'
import { 
  Users, 
  Fuel, 
  Settings, 
  Car, 
  Shield, 
  Wifi, 
  Snowflake,
  Calendar,
  MapPin,
  Star
} from 'lucide-react'
import { formatPrice } from '@/utils/priceCalc'

export default function CarDetailsPage() {
  const params = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchCarDetails()
  }, [params.id])

  const fetchCarDetails = async () => {
    try {
      const response = await carService.getCarById(params.id)
      setCar(response.data)
    } catch (error) {
      console.error('Error fetching car details:', error)
      // Fallback to mock data
      setCar(getMockCar())
    } finally {
      setLoading(false)
    }
  }

  const getMockCar = () => ({
    id: params.id,
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5 xDrive40i',
    year: 2023,
    pricePerDay: 129,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.0L 6-cylinder',
    horsepower: 335,
    features: ['GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Backup Camera'],
    images: [
      '/cars/bmw-x5-1.jpg',
      '/cars/bmw-x5-2.jpg',
      '/cars/bmw-x5-3.jpg',
    ],
    rating: 4.8,
    reviews: 128,
    description: 'Experience luxury and performance with the BMW X5. This premium SUV offers unmatched comfort, advanced technology, and powerful performance.'
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Car not found</h2>
          <p className="text-gray-600">The car you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-primary-500">Home</a>
          <span className="mx-2">/</span>
          <a href="/cars" className="hover:text-primary-500">Cars</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details & Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={car.images?.[selectedImage] || '/placeholder.png'}
                alt={`${car.name} - ${selectedImage + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 mb-8">
              {car.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Car Info */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{car.name}</h1>
                  <p className="text-gray-600 text-lg">{car.brand} • {car.model} • {car.year}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">{formatPrice(car.pricePerDay)}</div>
                  <div className="text-gray-600">per day</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(car.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="font-semibold">{car.rating}</span>
                <span className="text-gray-600">({car.reviews} reviews)</span>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="text-gray-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Seats</div>
                      <div className="font-semibold">{car.seats}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="text-gray-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Fuel Type</div>
                      <div className="font-semibold">{car.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="text-gray-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-semibold">{car.transmission}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="text-gray-500" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Engine</div>
                      <div className="font-semibold">{car.engine}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <BookingForm car={car} />
            
            {/* Additional Info */}
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">Why Book This Car</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="text-primary-500 mt-1" size={20} />
                  <div>
                    <div className="font-medium">Full Insurance Included</div>
                    <div className="text-sm text-gray-600">Comprehensive coverage for peace of mind</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="text-primary-500 mt-1" size={20} />
                  <div>
                    <div className="font-medium">Flexible Booking</div>
                    <div className="text-sm text-gray-600">Free cancellation up to 24 hours before</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="text-primary-500 mt-1" size={20} />
                  <div>
                    <div className="font-medium">Multiple Locations</div>
                    <div className="text-sm text-gray-600">Pickup and dropoff at different locations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}