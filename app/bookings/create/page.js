"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/utils/priceCalc";
import axios from "axios";
import Alert from "@/components/Alert";
import { Calendar, MapPin, User, Car, DollarSign, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");

  const [user, setUser] = useState(null);
  const [car, setCar] = useState(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const [selectedReturnLocation, setSelectedReturnLocation] = useState(null);

  const [bookingData, setBookingData] = useState({
    pickupDate: "",
    dropoffDate: "",
    pickup_location_name: "",
    return_location_name: "",
  });

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name,
        token: sessionStorage.getItem("token"),
      });
    } else {
      router.replace(
        `/auth/login?redirect=/bookings/create?carId=${carId || ""}`
      );
    }
  }, [router, carId]);

  // Fetch car
  useEffect(() => {
    if (!carId) {
      router.replace("/cars");
      return;
    }
    if (!user) return;

    const fetchCar = async () => {
      try {
        setLoadingCar(true);
        const res = await fetch(`http://127.0.0.1:4000/api/cars/${carId}`);
        if (!res.ok) throw new Error("Car not found");
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error(err);
        router.replace("/cars");
      } finally {
        setLoadingCar(false);
      }
    };

    fetchCar();
  }, [carId, user, router]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:4000/api/locations");
        setLocations(res.data);
      } catch (err) {
        console.error(err);
        Alert.error("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  const dailyPrice = car?.pricePerDay || 0;
  const days =
    bookingData.pickupDate && bookingData.dropoffDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(bookingData.dropoffDate) -
              new Date(bookingData.pickupDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const totalPrice = days * dailyPrice;

  const handleLocationChange = (type, value) => {
    const location = locations.find(loc => loc.name === value);
    if (type === 'pickup') {
      setSelectedPickupLocation(location);
      setBookingData({ ...bookingData, pickup_location_name: value });
    } else {
      setSelectedReturnLocation(location);
      setBookingData({ ...bookingData, return_location_name: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.name || !user.token) {
      Alert.error("User not authenticated", "Please login to continue");
      return;
    }
    if (!bookingData.pickupDate || !bookingData.dropoffDate) {
      Alert.warning("Select Dates", "Please select pickup and dropoff dates");
      return;
    }
    if (
      !bookingData.pickup_location_name ||
      !bookingData.return_location_name
    ) {
      Alert.warning(
        "Select Locations",
        "Please select pickup and return locations"
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        user_name: user.name,
        car_id: car._id || carId,
        start_date: new Date(bookingData.pickupDate).toISOString(),
        end_date: new Date(bookingData.dropoffDate).toISOString(),
        pickup_location_name: bookingData.pickup_location_name,
        return_location_name: bookingData.return_location_name,
        total_price: totalPrice,
      };

      const res = await axios.post(
        "http://127.0.0.1:4000/api/booking",
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      Alert.success("Booking Successful", `Thank you, ${user.name}!`);
      router.push(`/bookings/${res.data._id}`);
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      Alert.error(
        "Booking Failed",
        err.response?.data?.error || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCar || !user || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 px-4">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>! 
            Just a few details to secure your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Car Details */}
          <div className="space-y-8">
            {/* Car Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={car.images?.[0] || "/placeholder.png"}
                  alt={car.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Available Now
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-lg font-bold text-blue-600">{formatPrice(dailyPrice)}</span>
                  <span className="text-gray-500 text-sm">/day</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
                    <p className="text-gray-500">
                      {car.brand} • {car.model} • {car.year || '2023'}
                    </p>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">{car.type || 'Premium'}</span>
                  </div>
                </div>

                {/* Car Features */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{car.transmission || 'Automatic'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="font-medium">{car.seats || 5} People</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuel</p>
                      <p className="font-medium">{car.fuelType || 'Gasoline'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance</p>
                      <p className="font-medium">Included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Rental Period</span>
                  </div>
                  <span className="font-bold">{days} {days === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Daily Rate</span>
                  </div>
                  <span className="font-bold">{formatPrice(dailyPrice)}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total Amount</span>
                    <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Booking Details
                </h3>

                <div className="space-y-6">
                  {/* Date Picker Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        Pickup Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                          value={bookingData.pickupDate}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, pickupDate: e.target.value })
                          }
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        Dropoff Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                          value={bookingData.dropoffDate}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, dropoffDate: e.target.value })
                          }
                          min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        Pickup Location
                      </label>
                      <div className="relative">
                        <select
                          value={bookingData.pickup_location_name}
                          onChange={(e) => handleLocationChange('pickup', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-300"
                        >
                          <option value="">Select pickup location</option>
                          {locations.map((loc) => (
                            <option key={loc._id} value={loc.name}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <div className="absolute right-3 top-3.5">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {selectedPickupLocation && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Address:</span> {selectedPickupLocation.address}
                          </p>
                          {selectedPickupLocation.phone && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Phone:</span> {selectedPickupLocation.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        Return Location
                      </label>
                      <div className="relative">
                        <select
                          value={bookingData.return_location_name}
                          onChange={(e) => handleLocationChange('return', e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-300"
                        >
                          <option value="">Select return location</option>
                          {locations.map((loc) => (
                            <option key={loc._id} value={loc.name}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <div className="absolute right-3 top-3.5">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {selectedReturnLocation && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Address:</span> {selectedReturnLocation.address}
                          </p>
                          {selectedReturnLocation.phone && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Phone:</span> {selectedReturnLocation.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Daily Rate × {days} days</span>
                    <span className="font-medium">{formatPrice(dailyPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium text-green-600">Included</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Your Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Confirm & Book Now</span>
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  By clicking "Confirm & Book Now", you agree to our 
                  <a href="/terms" className="text-blue-600 hover:underline ml-1">Terms of Service</a> and 
                  <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
                </p>
              </div>
            </form>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-4">What's Included</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Free Cancellation</p>
                    <p className="text-xs text-gray-500">Cancel up to 24 hours before</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Full Insurance</p>
                    <p className="text-xs text-gray-500">Comprehensive coverage included</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">24/7 Support</p>
                    <p className="text-xs text-gray-500">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">No Hidden Fees</p>
                    <p className="text-xs text-gray-500">Price shown is final</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Car Details</span>
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}