"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/priceCalc";
import { useRouter } from "next/navigation";
import {
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  CreditCard,
  Calendar,
  MapPin,
  DollarSign,
  X,
  Filter,
  RefreshCw,
  ChevronRight,
  Receipt,
  Eye,
  AlertTriangle,
  Sparkles,
  BadgeCheck,
  Phone,
  Star,
  Award,
  Trophy,
  CheckSquare,
  ShieldCheck,
  Zap,
  Heart,
} from "lucide-react";
import Alert from "@/components/Alert";
import axios from "axios";

export default function MyBookingsPage() {
  const { user } = useAuth() || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const router = useRouter();

  // =========================
  // GET USER INFO FROM SESSION STORAGE
  // =========================
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserInfo({
            name: parsedUser.name || "User",
            phone: parsedUser.phone || "No phone number",
          });
        }
      } catch (error) {
        console.error("Error reading from session storage:", error);
      }
    }
  }, []);

  // =========================
  // FETCH USER BOOKINGS
  // =========================
  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setRefreshing(true);
      const res = await axios.get("http://localhost:4000/api/booking/my", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBookings(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
      Alert.error("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  // =========================
  // FILTER BOOKINGS
  // =========================
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status?.toLowerCase() === filter);
  }, [bookings, filter]);

  // =========================
  // STATUS CONFIGURATION
  // =========================
  const getStatusConfig = (status) => {
    const statusLower = (status || "").toLowerCase();

    switch (statusLower) {
      case "confirmed":
        return {
          color: "from-emerald-500 to-green-600",
          bg: "bg-gradient-to-r from-emerald-50 to-green-50",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Confirmed",
          badge: "bg-gradient-to-r from-emerald-500 to-green-600",
        };
      case "completed":
        return {
          color: "from-blue-500 to-cyan-600",
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: <Shield className="w-4 h-4" />,
          label: "Completed",
          badge: "bg-gradient-to-r from-blue-500 to-cyan-600",
        };
      case "pending":
        return {
          color: "from-amber-500 to-orange-600",
          bg: "bg-gradient-to-r from-amber-50 to-orange-50",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
          badge: "bg-gradient-to-r from-amber-500 to-orange-600",
        };
      case "cancelled":
        return {
          color: "from-rose-500 to-red-600",
          bg: "bg-gradient-to-r from-rose-50 to-red-50",
          text: "text-rose-800",
          border: "border-rose-200",
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Cancelled",
          badge: "bg-gradient-to-r from-rose-500 to-red-600",
        };
      default:
        return {
          color: "from-gray-500 to-slate-600",
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: <Clock className="w-4 h-4" />,
          label: status || "Unknown",
          badge: "bg-gradient-to-r from-gray-500 to-slate-600",
        };
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      Alert.info("Processing", "Cancelling your booking...");
      await axios.delete(`http://localhost:4000/api/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      Alert.success("Cancelled", "Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      Alert.error(
        "Error",
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  // =========================
  // LOADING / AUTH STATES
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 rounded-full animate-spin border-t-primary-600"></div>
            <Car className="w-8 h-8 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">
            Loading your bookings...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Preparing your rental history
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center p-12 max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Please sign in to view and manage your car rental bookings
            </p>
            <button
              onClick={() => router.push("/users/login")}
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Sign In to Continue
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Action Buttons */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Left side: Title */}
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">My Bookings</h1>

          {/* Right side: Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/payment")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2 justify-center"
            >
              Payments
            </button>
            <button
              onClick={() => router.push("/cars")}
              className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              <Car className="w-5 h-5" />
              Book New Car
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Welcome Header with User Info */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 text-white p-8 mb-8 shadow-2xl">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  {/* Welcome Message */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-1">
                        Welcome back,{" "}
                        <span className="text-yellow-300">
                          {userInfo.name}!
                        </span>
                      </h1>
                      <p className="text-primary-100 opacity-90">
                        Here's an overview of all your car rental bookings
                      </p>
                    </div>
                  </div>

                  {/* User Contact Info */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{userInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">{userInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Loyal Customer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 shadow-lg border border-primary-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">{bookings.length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">
                  {bookings.filter(b => b.status?.toLowerCase() === "confirmed").length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">
                  {bookings.filter(b => b.status?.toLowerCase() === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Filter Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter Your Bookings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sort by booking status
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(
                (f) => {
                  const isActive = filter === f;
                  const statusConfig = getStatusConfig(
                    f === "all" ? "confirmed" : f
                  );

                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                        isActive
                          ? `${statusConfig.bg} ${statusConfig.border} border-2 text-gray-900 shadow-lg`
                          : "bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:shadow-md"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {f !== "all" && (
                          <span
                            className={
                              isActive ? "text-current" : "text-gray-400"
                            }
                          >
                            {statusConfig.icon}
                          </span>
                        )}
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {isActive && (
                          <Sparkles className="w-3 h-3 ml-1 text-primary-500" />
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Premium Bookings Grid */}
        {!filteredBookings.length ? (
          <div className="text-center py-20 bg-gradient-to-br from-white to-primary-50 rounded-3xl shadow-xl border border-primary-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't made any bookings yet. Start your journey with us!"
                : `No ${filter} bookings found.`}
            </p>
            <button
              onClick={() => router.push("/cars")}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Available Cars
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);

              return (
                <div
                  key={booking._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Premium Status Header */}
                  <div
                    className={`${statusConfig.bg} ${statusConfig.border} px-6 py-4 border-b relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${statusConfig.border} bg-white/50 backdrop-blur-sm`}
                        >
                          {statusConfig.icon}
                        </div>
                        <div>
                          <span className={`font-bold ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                          <div className="text-sm text-gray-600">
                            Booking #{booking._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-6">
                    {/* Car Info with Icon */}
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                          <Car className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {booking.carName}
                          </h3>
                          <p className="text-gray-600">
                            {booking.carBrand} • {booking.carModel}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Dates Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">Pickup</span>
                        </div>
                        <p className="font-semibold">
                          {formatDate(booking.pickupDate)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {booking.pickupLocation}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">Return</span>
                        </div>
                        <p className="font-semibold">
                          {formatDate(booking.dropoffDate)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {booking.dropoffLocation}
                        </div>
                      </div>
                    </div>

                    {/* Premium Price Display */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            {formatPrice(booking.totalPrice)}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl">
                          <DollarSign className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                    </div>

                    {/* Premium Action Buttons */}
                    <div className="flex gap-3">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="flex-1 bg-gradient-to-r from-rose-50 to-white border border-rose-200 text-rose-700 px-4 py-3 rounded-xl font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel Booking
                        </button>
                      )}

                      {booking.status === "confirmed" &&
                        booking.paymentStatus === "unpaid" && (
                          <button
                            onClick={() =>
                              router.push(`/payment/${booking._id}`)
                            }
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        )}
                    </div>

                    {/* Payment Alert */}
                    {booking.status === "confirmed" &&
                      booking.paymentStatus === "unpaid" && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-amber-800 font-medium">
                                Booking approved. Complete payment to reserve
                                the car.
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                Your booking will be secured once payment is
                                confirmed
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Premium Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Booking Details
                    </h2>
                    <p className="text-gray-600">ID: {selectedBooking._id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Enhanced Car Info */}
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Car className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedBooking.carName}
                        </h3>
                        <p className="text-gray-600">
                          {selectedBooking.carBrand} •{" "}
                          {selectedBooking.carModel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Dates */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">Pickup Date</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDate(selectedBooking.pickupDate)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedBooking.pickupLocation}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold">Return Date</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDate(selectedBooking.dropoffDate)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedBooking.dropoffLocation}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Price & Status */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Booking Status</h4>
                      <div className="flex items-center gap-3">
                        {getStatusConfig(selectedBooking.status).icon}
                        <span className="font-bold text-lg">
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Total Amount</h4>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatPrice(selectedBooking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Loyalty Footer */}
        {bookings.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Loyal Customer Benefits
                </span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                Thank you for being a valued member of DriveRent. Each booking
                contributes to your loyalty rewards. Continue your journey with
                us and unlock exclusive benefits.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
