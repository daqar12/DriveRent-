"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import Alert from "@/components/Alert";
import {
  Search,
  Filter,
  Calendar,
  User,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  DollarSign,
  MapPin,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/priceCalc";
import { downloadPDF, downloadExcel } from "@/utils/download";

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/booking", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const json = await res.json();

      // Map backend properties to frontend-friendly names
      const mappedBookings = Array.isArray(json.data)
        ? json.data.map((b) => ({
            id: b._id,
            bookingId: b._id.slice(-6).toUpperCase(), // short booking id
            userName: b.user_name,
            userEmail: b.user_email,
            carName: b.car_id?.name || "",
            carBrand: b.car_id?.brand || "",
            carModel: b.car_id?.model || "",
            pickupDate: b.start_date,
            dropoffDate: b.end_date,
            pickupLocation: b.pickup_location_id,
            returnLocation: b.return_location_id,
            totalPrice: b.total_price,
            status: b.status,
            paymentStatus: b.payment_status,
            createdAt: b.created_at,
            days: Math.ceil(
              (new Date(b.end_date) - new Date(b.start_date)) /
                (1000 * 60 * 60 * 24)
            ),
          }))
        : [];

      setBookings(mappedBookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      const res = await fetch(
        `http://localhost:4000/api/booking/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      Alert.success("Status Updated", `Booking status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.error("Update Failed", error.message);
    }
  };

  const handlePaymentStatusChange = async (id, newStatus) => {
    try {
      setBookings(
        bookings.map((b) =>
          b.id === id ? { ...b, paymentStatus: newStatus } : b
        )
      );

      const res = await fetch(
        `http://localhost:4000/api/booking/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_status: newStatus }), // ✅ backend now handles this
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update payment status");
      }

      Alert.success(
        "Payment Status Updated",
        `Payment status changed to ${newStatus}`
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      Alert.error("Update Failed", error.message);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || booking.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <DollarSign size={12} className="mr-1" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Management
            </h1>
            <p className="text-gray-600">
              Manage all rental bookings and reservations
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {
                  bookings.filter(
                    (b) => b.status === "confirmed" || b.status === "pending"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">
                $
                {bookings
                  .reduce((sum, booking) => sum + booking.totalPrice, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {bookings.filter((b) => b.paymentStatus === "paid").length}
              </div>
              <div className="text-sm text-gray-600">Paid Bookings</div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer & Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates & Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div> */}
                          <div className="text-sm text-gray-500">
                            {formatDateTime(booking.createdAt)}
                          </div>
                          <div className="text-lg font-bold text-blue-600 mt-1">
                            {formatPrice(booking.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.days} day{booking.days > 1 ? "s" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.userEmail}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <Car className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-700">
                              {booking.carName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar
                                size={14}
                                className="text-gray-400 mr-1"
                              />
                              {formatDate(booking.pickupDate)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              to {formatDate(booking.dropoffDate)}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="text-gray-400 mr-1"
                              />
                              {booking.pickupLocation}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div>{getStatusBadge(booking.status)}</div>
                            <div>
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {/* <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/bookings/view/${booking.id}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button> */}

                            <select
                              value={booking.status}
                              onChange={(e) =>
                                handleStatusChange(booking.id, e.target.value)
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                              value={booking.paymentStatus}
                              onChange={(e) =>
                                handlePaymentStatusChange(
                                  booking.id,
                                  e.target.value
                                )
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">pending</option>
                              <option value="paid">Paid</option>
                              <option value="refunded">Refunded</option>
                            </select>
                            <button
                              className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                              title="Download Invoice"
                              onClick={() => downloadPDF(booking)}
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "No bookings in the system"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
