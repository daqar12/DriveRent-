// components/EditCarModal.js
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Alert from "./Alert";

export default function EditCarModal({ car, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    status: "available",
    fuelType: "",
    transmission: "",
    seats: 4,
  });

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || "",
        brand: car.brand || "",
        model: car.model || "",
        year: car.year || "",
        pricePerDay: car.pricePerDay || "",
        location: car.location || "",
        status: car.status || "available",
        fuelType: car.fuelType || "",
        transmission: car.transmission || "",
        seats: car.seats || 4,
      });
    }
  }, [car]);

  if (!isOpen || !car) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://127.0.0.1:4000/api/cars/${car._id || car.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update car");

      const updatedCar = await res.json();
      onUpdate(updatedCar);
      Alert.success("Success", "Car updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      Alert.error("Error", err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Car Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Car Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            {/* Model */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Price per Day ($)</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                disabled
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                disabled
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Fuel Type</label>
              <input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Transmission */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Transmission</label>
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Seats */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-600 font-medium">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-semibold text-lg hover:scale-105 transform transition-all shadow-lg"
          >
            Update Car
          </button>
        </form>
      </div>
    </div>
  );
}
