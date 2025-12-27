"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Car, Upload, Loader } from "lucide-react";
import Alert from "@/components/Alert"; // corrected import path

export default function AddCarModal({ isOpen, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: "",
    seats: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    mileage: "",
    location_id: "",
    locationName: "",
    description: "",
    image: "",
    rating: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:4000/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Always parse JSON safely
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const message = data.message || data.error || "Failed to add car";
        throw new Error(message);
      }

      console.log("Car added:", data);
      Alert.success("Success!", "The car has been added to your fleet.");
      onClose();
      router.push("/dashboard/cars");
    } catch (error) {
      console.error(error);
      Alert.error(
        "Oops!",
        error.message || "Something went wrong while adding the car."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/locations");
        const data = await res.json();

        // adjust if your API wraps data (data.locations)
        setLocations(data.locations || data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Car</h2>
                  <p className="text-blue-100">
                    Fill in the details to add a new vehicle to your fleet
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Car Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., BMW X5 2023"
                  />
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      required
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="BMW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      required
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="X5"
                    />
                  </div>
                </div>

                {/* Year & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      required
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price/Day ($) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      min="0"
                      step="0.01"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="129.99"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the car features..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Seats & Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seats *
                    </label>
                    <input
                      type="number"
                      name="seats"
                      required
                      min="2"
                      max="8"
                      value={formData.seats}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1 to 5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="4.5"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    name="location_id"
                    value={formData.location}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const selected = locations.find(
                        (loc) => loc._id === e.target.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        location_id: selected._id, // send to backend
                        locationName: selected.name, // store for display
                      }));
                    }}
                    required
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fuel & Transmission */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type *
                    </label>
                    <select
                      name="fuelType"
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
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    <Upload className="h-6 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Paste an image URL or upload later
                    </p>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/car-image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Adding Car...</span>
                  </>
                ) : (
                  <>
                    <Car className="h-5 w-5" />
                    <span>Add Car to Fleet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
