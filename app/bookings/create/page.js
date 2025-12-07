// app/bookings/create/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth() || {};

  // Get car details from URL parameters
  const carId = searchParams.get("carId");
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const location = searchParams.get("location") || "";

  const [step, setStep] = useState(1); // 1: Personal Info, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState(null);
  const [bookingData, setBookingData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    country: "",

    // Rental Details
    pickupDate: pickupDate,
    dropoffDate: dropoffDate,
    pickupLocation: location,
    dropoffLocation: location,
    specialRequests: "",

    // Payment Details
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,

    // Insurance
    insuranceType: "basic",

    // Additional Services
    services: [],
  });

  const [errors, setErrors] = useState({});

  // Mock car data - in real app, fetch from API
  const mockCars = {
    1: {
      id: "1",
      name: "BMW X5",
      model: "X5 2023",
      image: "/cars/bmw-x5.jpg",
      dailyRate: 129,
      category: "SUV",
      seats: 5,
      fuelType: "Petrol",
      transmission: "Automatic",
      features: ["GPS", "Bluetooth", "Sunroof", "Heated Seats"],
    },
    2: {
      id: "2",
      name: "Tesla Model 3",
      model: "Model 3 2024",
      image: "/cars/tesla-model3.jpg",
      dailyRate: 99,
      category: "Electric",
      seats: 5,
      fuelType: "Electric",
      transmission: "Automatic",
      features: ["Autopilot", "Premium Sound", "Glass Roof"],
    },
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/bookings/create");
      return;
    }

    if (carId && mockCars[carId]) {
      setCar(mockCars[carId]);
      // Pre-fill user info if available
      setBookingData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        pickupDate: pickupDate || prev.pickupDate,
        dropoffDate: dropoffDate || prev.dropoffDate,
        pickupLocation: location || prev.pickupLocation,
        dropoffLocation: location || prev.dropoffLocation,
      }));
    } else if (!carId) {
      // If no car selected, redirect to cars page
      router.push("/cars");
    }
  }, [user, router, carId, pickupDate, dropoffDate, location]);

  // Calculate rental duration and price
  const calculateRentalDetails = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate || !car) {
      return {
        days: 0,
        subtotal: 0,
        insuranceCost: 0,
        servicesCost: 0,
        tax: 0,
        total: 0,
      };
    }

    try {
      const start = new Date(bookingData.pickupDate);
      const end = new Date(bookingData.dropoffDate);
      const days = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      );

      const subtotal = days * (car.dailyRate || 0);
      const insuranceCost =
        bookingData.insuranceType === "premium"
          ? days * 15
          : bookingData.insuranceType === "basic"
          ? days * 10
          : 0;
      const servicesCost = (bookingData.services?.length || 0) * 10 * days;
      const tax = (subtotal + insuranceCost + servicesCost) * 0.08;

      return {
        days,
        subtotal,
        insuranceCost,
        servicesCost,
        tax,
        total: subtotal + insuranceCost + servicesCost + tax,
      };
    } catch (error) {
      console.error("Error calculating rental details:", error);
      return {
        days: 0,
        subtotal: 0,
        insuranceCost: 0,
        servicesCost: 0,
        tax: 0,
        total: 0,
      };
    }
  };

  const rentalDetails = calculateRentalDetails();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleServiceToggle = (service) => {
    setBookingData((prev) => ({
      ...prev,
      services:
        Array.isArray(prev.services) && prev.services.includes(service)
          ? prev.services.filter((s) => s !== service)
          : [...(Array.isArray(prev.services) ? prev.services : []), service],
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!bookingData.fullName?.trim())
        newErrors.fullName = "Full name is required";
      if (!bookingData.email?.trim()) newErrors.email = "Email is required";
      if (!bookingData.phone?.trim())
        newErrors.phone = "Phone number is required";
      if (!bookingData.licenseNumber?.trim())
        newErrors.licenseNumber = "Driver's license is required";
      if (!bookingData.pickupDate)
        newErrors.pickupDate = "Pickup date is required";
      if (!bookingData.dropoffDate)
        newErrors.dropoffDate = "Drop-off date is required";
      if (!bookingData.pickupLocation?.trim())
        newErrors.pickupLocation = "Pickup location is required";

      // Validate dates
      if (bookingData.pickupDate && bookingData.dropoffDate) {
        try {
          const start = new Date(bookingData.pickupDate);
          const end = new Date(bookingData.dropoffDate);
          if (end <= start) {
            newErrors.dropoffDate = "Drop-off date must be after pickup date";
          }
        } catch (error) {
          newErrors.dropoffDate = "Invalid date format";
        }
      }
    }

    if (stepNumber === 2) {
      const cardNumber = bookingData.cardNumber?.replace(/\s/g, "") || "";
      if (!cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = "Valid 16-digit card number is required";
      }
      if (!bookingData.cardHolder?.trim())
        newErrors.cardHolder = "Card holder name is required";
      if (!bookingData.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiryDate = "Valid expiry date (MM/YY) is required";
      }
      if (!bookingData.cvv?.match(/^\d{3,4}$/))
        newErrors.cvv = "Valid CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) return;

    setLoading(true);

    try {
      const bookingPayload = {
        user_id: user.id, // <-- halkan user_id ka logged-in
        car_id: car.id,
        full_name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        license_number: bookingData.licenseNumber,
        pickup_date: bookingData.pickupDate,
        dropoff_date: bookingData.dropoffDate,
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        special_requests: bookingData.specialRequests,
        insurance_type: bookingData.insuranceType,
        services: bookingData.services,
        payment: {
          card_number: bookingData.cardNumber,
          card_holder: bookingData.cardHolder,
          expiry_date: bookingData.expiryDate,
          cvv: bookingData.cvv,
          save_card: bookingData.saveCard,
        },
      };

      // Call your API
      const res = await fetch("http://127.0.0.1:4000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await res.json();
      const bookingId = result.id;

      router.push(`/bookings/confirmation?id=${bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const insuranceOptions = [
    {
      id: "basic",
      name: "Basic Insurance",
      description: "Standard coverage",
      price: 10,
    },
    {
      id: "premium",
      name: "Premium Insurance",
      description: "Full coverage with zero deductible",
      price: 15,
    },
  ];

  const additionalServices = [
    { id: "gps", name: "GPS Navigation", price: 10 },
    { id: "childSeat", name: "Child Safety Seat", price: 10 },
    { id: "additionalDriver", name: "Additional Driver", price: 15 },
  ];

  // Safe price formatting function
  const formatPrice = (value) => {
    const num = Number(value) || 0;
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${
                      step === stepNumber
                        ? "bg-blue-600 border-blue-600 text-white"
                        : step > stepNumber
                        ? "bg-green-100 border-green-500 text-green-600"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > stepNumber ? "✓" : stepNumber}
                  </div>
                  <div className="ml-2 text-sm font-medium hidden sm:block">
                    {stepNumber === 1 && "Personal Info"}
                    {stepNumber === 2 && "Payment"}
                    {stepNumber === 3 && "Confirmation"}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Please provide your details for the booking
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <User size={16} />
                    <span>Step 1 of 3</span>
                  </div>
                </div>

                <form className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={bookingData.fullName}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver's License Number *
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={bookingData.licenseNumber}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.licenseNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="DL123456789"
                      />
                      {errors.licenseNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.licenseNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Rental Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Pickup Date *
                          </span>
                        </label>
                        <input
                          type="date"
                          name="pickupDate"
                          value={bookingData.pickupDate}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pickupDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.pickupDate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.pickupDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Drop-off Date *
                          </span>
                        </label>
                        <input
                          type="date"
                          name="dropoffDate"
                          value={bookingData.dropoffDate}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.dropoffDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min={
                            bookingData.pickupDate ||
                            new Date().toISOString().split("T")[0]
                          }
                        />
                        {errors.dropoffDate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.dropoffDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Pickup Location *
                          </span>
                        </label>
                        <input
                          type="text"
                          name="pickupLocation"
                          value={bookingData.pickupLocation}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pickupLocation
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter pickup location"
                        />
                        {errors.pickupLocation && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.pickupLocation}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Drop-off Location (optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="dropoffLocation"
                          value={bookingData.dropoffLocation}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Same as pickup"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Details
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Secure payment with 256-bit SSL encryption
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <CreditCard size={16} />
                    <span>Step 2 of 3</span>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={bookingData.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          handleInputChange({
                            ...e,
                            target: { ...e.target, value, name: "cardNumber" },
                          });
                        }}
                        maxLength={19}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Holder Name *
                      </label>
                      <input
                        type="text"
                        name="cardHolder"
                        value={bookingData.cardHolder}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardHolder
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="JOHN DOE"
                      />
                      {errors.cardHolder && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.cardHolder}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={bookingData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          handleInputChange({
                            ...e,
                            target: { ...e.target, value, name: "expiryDate" },
                          });
                        }}
                        maxLength={5}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={bookingData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="saveCard"
                          checked={bookingData.saveCard}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Save card for future payments
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Insurance Selection */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Insurance Options
                    </h3>
                    <div className="space-y-4">
                      {insuranceOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            bookingData.insuranceType === option.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="radio"
                              name="insuranceType"
                              value={option.id}
                              checked={bookingData.insuranceType === option.id}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {option.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-gray-900">
                            ${option.price}/day
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Additional Services
                    </h3>
                    <div className="space-y-3">
                      {additionalServices.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(bookingData.services) &&
                                bookingData.services.includes(service.id)
                              }
                              onChange={() => handleServiceToggle(service.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-900">
                              {service.name}
                            </span>
                          </div>
                          <div className="font-bold text-gray-900">
                            ${service.price}/day
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Booking Confirmation
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Review and confirm your booking details
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle size={16} />
                    <span>Step 3 of 3</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Booking Summary
                      </h3>
                      <div className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        Booking ID: DR-{Date.now().toString().slice(-6)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600">
                          Pickup Date & Time
                        </div>
                        <div className="font-bold text-gray-900">
                          {bookingData.pickupDate
                            ? formatDate(bookingData.pickupDate)
                            : "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Drop-off Date & Time
                        </div>
                        <div className="font-bold text-gray-900">
                          {bookingData.dropoffDate
                            ? formatDate(bookingData.dropoffDate)
                            : "Not set"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-bold text-gray-900">
                        {rentalDetails.days} day
                        {rentalDetails.days !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Terms & Conditions
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600 max-h-60 overflow-y-auto pr-2">
                      <p>By proceeding, you agree to the following terms:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          You must be at least 25 years old with a valid
                          driver's license
                        </li>
                        <li>Smoking is strictly prohibited in all vehicles</li>
                        <li>
                          A security deposit of $200 will be held on your card
                        </li>
                        <li>
                          Cancellation within 24 hours of pickup incurs a 50%
                          fee
                        </li>
                        <li>
                          Late returns will be charged at 1.5x the daily rate
                        </li>
                        <li>Additional drivers must be registered at pickup</li>
                        <li>
                          All fuel costs are the responsibility of the renter
                        </li>
                      </ul>

                      <div className="flex items-start space-x-3 mt-4">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          required
                        />
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the Terms & Conditions and understand that
                          a $200 security deposit will be held on my card.
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Need Help?
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Our customer support team is available 24/7 to assist you
                      with any questions or concerns.
                    </p>
                    <div className="flex items-center space-x-2 text-blue-600 font-medium">
                      <Phone size={18} />
                      <span>+1 (800) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handlePreviousStep}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>
                    Continue to {step === 1 ? "Payment" : "Confirmation"}
                  </span>
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitBooking}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>
                        Confirm & Pay ${formatPrice(rentalDetails.total)}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Car Details */}
          <div className="space-y-8">
            {/* Car Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Selection
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {car.name || "Car Name"}
                    </h3>
                    <p className="text-gray-600">{car.model || "Car Model"}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {car.category || "Category"}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {car.seats || 0} seats
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600">Fuel Type</div>
                    <div className="font-medium">
                      {car.fuelType || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Transmission</div>
                    <div className="font-medium">
                      {car.transmission || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Included Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(car.features) && car.features.length > 0 ? (
                    car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No features listed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Price Breakdown
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${formatPrice(car.dailyRate)} × {rentalDetails.days} day
                    {rentalDetails.days !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">
                    ${formatPrice(rentalDetails.subtotal)}
                  </span>
                </div>

                {rentalDetails.insuranceCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">
                      ${formatPrice(rentalDetails.insuranceCost)}
                    </span>
                  </div>
                )}

                {rentalDetails.servicesCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Services</span>
                    <span className="font-medium">
                      ${formatPrice(rentalDetails.servicesCost)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">
                    ${formatPrice(rentalDetails.tax)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${formatPrice(rentalDetails.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Deposit */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <Shield
                    className="text-yellow-600 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      Security Deposit
                    </div>
                    <div className="text-sm text-gray-600">
                      A $200 hold will be placed on your card and released
                      within 5-7 business days after return.
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock
                    className="text-gray-600 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      Cancellation Policy
                    </div>
                    <div className="text-sm text-gray-600">
                      Free cancellation up to 24 hours before pickup. 50% fee
                      applies for later cancellations.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Need Assistance?
              </h3>
              <p className="text-gray-700 mb-4">
                Our team is here to help you 24/7 with any questions about your
                booking.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone size={18} className="text-blue-600" />
                  <span className="text-gray-700">+1 (800) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="text-blue-600" />
                  <span className="text-gray-700">support@driverent.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
