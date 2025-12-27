// app/locations/page.js
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";
import { MapPin, Phone, Mail, Clock, Navigation, Car } from "lucide-react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapContainerStyle = { width: "100%", height: "300px" };
  const defaultCenter = { lat: 2.0469, lng: 45.3182 }; // Mogadishu

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/locations");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const getMapCenter = () => {
    if (selectedLocation) {
      const lat = Number(selectedLocation.lat);
      const lng = Number(selectedLocation.lng);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return defaultCenter;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppChatPopup />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Locations</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find a DriveRent location near you. We're conveniently located across major cities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Locations List */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Pickup & Drop-off Locations</h2>
              <p className="text-gray-600">Choose from our network of premium locations</p>
            </div>

            <div className="space-y-6">
              {locations.map((location, index) => (
                <div
                  key={`${location.name}-${index}`}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    activeLocation === index ? "border-blue-500" : "border-transparent hover:border-blue-200"
                  }`}
                  onClick={() => {
                    setActiveLocation(index);
                    setSelectedLocation(location);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <MapPin className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Navigation size={16} />
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium "
                            >
                              Get Directions
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="text-gray-400 mt-1" size={18} />
                          <div>
                            <div className="text-sm text-gray-600">Address</div>
                            <div className="font-medium">{location.address}</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Phone className="text-gray-400 mt-1" size={18} />
                          <div>
                            <div className="text-sm text-gray-600">Phone</div>
                            <div className="font-medium">{location.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Mail className="text-gray-400 mt-1" size={18} />
                          <div>
                            <div className="text-sm text-gray-600">Email</div>
                            <div className="font-medium">{location.email}</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="text-gray-400 mt-1" size={18} />
                          <div>
                            <div className="text-sm text-gray-600">Hours</div>
                            <div className="font-medium">{location.hours}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {location.features.map((feature, idx) => (
                          <span
                            key={`${location.name}-feature-${idx}`}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap">
                      Select Location
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map & Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Head Quarter</h3>
              <p className="text-gray-600">Mogadishu, Somalia</p>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location Services</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Car className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Free Pickup & Dropoff</div>
                    <div className="text-sm text-gray-600">At all locations</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Extended Hours</div>
                    <div className="text-sm text-gray-600">Most locations open 6AM-12AM</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Navigation className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Easy Navigation</div>
                    <div className="text-sm text-gray-600">Conveniently located</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help Finding Us?</h3>
              <p className="text-gray-700 mb-4">
                Our customer service team is available 24/7 to help you find the perfect location.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="text-blue-600" size={18} />
                  <span className="font-medium">+1 (800) DRIVE-RENT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="text-blue-600" size={18} />
                  <span className="font-medium">locations@driverent.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{locations.length}+</div>
              <div className="text-blue-200">Locations Nationwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Service Hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
