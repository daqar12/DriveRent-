"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/components/Alert";
import { 
  CreditCard, 
  ArrowLeft, 
  Smartphone, 
  CheckCircle, 
  Lock, 
  DollarSign,
  Calendar,
  Car,
  MapPin,
  Copy,
  User
} from "lucide-react";
import { formatPrice } from "@/utils/priceCalc";
import { formatDate } from "@/utils/formatDate";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { user } = useAuth() || {};

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("EVC");
  const [senderNumber, setSenderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const companyNumber = "612747828";

  // =========================
  // FETCH BOOKING DETAILS
  // =========================
  useEffect(() => {
    if (!user) return;

    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setBooking(res.data);
      } catch (err) {
        Alert.error(
          "Error",
          err.response?.data?.message || "Failed to load booking"
        );
      }
    };

    fetchBooking();
  }, [bookingId, user]);

  // =========================
  // COPY COMPANY NUMBER
  // =========================
  const copyToClipboard = () => {
    navigator.clipboard.writeText(companyNumber);
    setCopied(true);
    Alert.success("Copied", "Company number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePayment = async () => {
    if (!paymentMethod) return Alert.error("Error", "Select payment method");
    if (!senderNumber) return Alert.error("Error", "Enter your number");

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:4000/api/payments/${bookingId}/pay`,
        {
          payment_method: paymentMethod,
          transaction_id: `TX-${Date.now()}`,
          sender_number: senderNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      Alert.success("Success", "Payment completed successfully");
      router.push("/bookings/user");
    } catch (err) {
      Alert.error(
        "Payment Failed",
        err.response?.data?.message || "Payment error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (!booking)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-primary-100 rounded-xl border border-gray-200">
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Complete Payment</h1>
                    <p className="text-gray-600 text-sm">Secure checkout process</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-primary-600">Booking Summary</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Car className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Car</p>
                          <p className="font-medium text-gray-900">{booking.carName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">Pickup Date</span>
                        </div>
                        <p className="font-medium text-sm">{formatDate(booking.pickupDate)}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <MapPin className="w-2 h-2" />
                          {booking.pickupLocation}
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">Return Date</span>
                        </div>
                        <p className="font-medium text-sm">{formatDate(booking.dropoffDate)}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <MapPin className="w-2 h-2" />
                          {booking.dropoffLocation}
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {formatPrice(booking.totalPrice)}
                          </p>
                        </div>
                        <DollarSign className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h2 className="font-medium text-gray-900 mb-4">Payment Method</h2>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => setPaymentMethod("EVC")}
                      className={`p-3 rounded-lg border transition-colors ${
                        paymentMethod === "EVC"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium">EVC Plus</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("Card")}
                      className={`p-3 rounded-lg border transition-colors ${
                        paymentMethod === "Card"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium">Card</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("Cash")}
                      className={`p-3 rounded-lg border transition-colors ${
                        paymentMethod === "Cash"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-xs font-medium">Cash</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sender Number Input */}
                <div className="mb-6">
                  <h2 className="font-medium text-gray-900 mb-3">Your Phone Number</h2>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="Enter your phone number (e.g., 612XXXXXX)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll use this number to confirm your payment
                  </p>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || !senderNumber || !paymentMethod}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    loading || !senderNumber || !paymentMethod
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Instructions */}
          <div className="space-y-6">
            {/* Company Number Card */}
            {paymentMethod === "EVC" && (
              <div className="bg-primary-100 rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Send Payment To</h3>
                    <p className="text-xs text-gray-600">Company EVC Number</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-semibold text-gray-900 mb-2">
                    {companyNumber}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Copy this number and send your payment
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Number
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Make sure the number is correct</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Use your phone number as reference</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Payment is processed instantly</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Features */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-3">Secure Payment</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Encrypted Connection</p>
                    <p className="text-xs text-gray-600">All data is securely encrypted</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0">•</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">No Card Storage</p>
                    <p className="text-xs text-gray-600">We don't store your payment details</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0">•</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instant Confirmation</p>
                    <p className="text-xs text-gray-600">Get immediate booking confirmation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-3">
                Contact our support team for payment assistance
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3 h-3 text-gray-500" />
                  <span className="text-xs">+252 61 274 7828</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3"></div>
                  <span>24/7 Support Available</span>
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