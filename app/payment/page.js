"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Download,
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Receipt,
  FileText,
  Printer,
  Eye,
  MoreVertical,
  ChevronRight,
  Filter,
  RefreshCw,
  ArrowDownToLine,
  BadgeCheck,
  AlertCircle,
  Wallet,
  X
} from "lucide-react";
import { formatDateTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/priceCalc";
import Alert from "@/components/Alert";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    if (user) fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/payments/user", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      console.log("User Payments API Response:", data); // Debug log

      if (res.ok && data.success) {
        const paymentsData = data.payments || [];
        setPayments(paymentsData);
        
        // Calculate stats
        const stats = {
          total: paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0),
          paid: paymentsData.filter(p => p.status === "paid").length,
          pending: paymentsData.filter(p => p.status === "pending").length,
          failed: paymentsData.filter(p => p.status === "failed").length
        };
        setStats(stats);
      } else {
        setPayments([]);
        Alert.error("Error", data.message || "Failed to fetch payments");
      }
    } catch (err) {
      setPayments([]);
      Alert.error("Error", err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  // ============================
  // PDF GENERATION FUNCTIONS
  // ============================

  const generateReceiptPDF = (payment) => {
    const doc = new jsPDF();
    
    // Header with Logo and Title
    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, 210, 40, 'F');
    
    // White text for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("DriveRent Car Rental", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text("Official Payment Receipt", 105, 30, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Receipt Title
    doc.setFontSize(20);
    doc.text("PAYMENT RECEIPT", 20, 60);
    
    // Receipt Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Customer Information
    doc.text(`Receipt No: ${payment._id?.slice(-8) || "N/A"}`, 20, 75);
    doc.text(`Date: ${formatDateTime(payment.paid_at || payment.createdAt)}`, 20, 82);
    doc.text(`Customer: ${user?.name || "Customer"}`, 20, 89);
    doc.text(`Email: ${user?.email || "N/A"}`, 20, 96);
    
    // Payment Details Box
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.rect(20, 105, 170, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", 25, 115);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Amount Paid: ${formatPrice(payment.amount || 0)}`, 25, 125);
    doc.text(`Payment Method: ${payment.payment_method || "N/A"}`, 25, 132);
    doc.text(`Transaction ID: ${payment.transaction_id || "N/A"}`, 25, 139);
    doc.text(`Status: ${payment.status || "N/A"}`, 25, 146);
    
    // Booking Information
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING INFORMATION", 20, 165);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Car: ${payment.booking_id?.car_name || "Car Booking"}`, 20, 175);
    doc.text(`Booking ID: ${payment.booking_id?._id || "N/A"}`, 20, 182);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing DriveRent Car Rental!", 105, 250, { align: 'center' });
    doc.text("For any inquiries, contact: support@driverent.com", 105, 257, { align: 'center' });
    doc.text("Phone: 612747828", 105, 264, { align: 'center' });
    
    // Save the PDF
    doc.save(`DriveRent_Receipt_${payment._id?.slice(-8)}.pdf`);
    
    Alert.success("Success", "Receipt downloaded successfully!");
  };

  const generateInvoicePDF = (payment) => {
  try {
    const doc = new jsPDF();
    
    // Header with Logo and Title
    doc.setFillColor(40, 167, 69);
    doc.rect(0, 0, 210, 40, 'F');
    
    // White text for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("DriveRent Car Rental", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text("Official Invoice", 105, 30, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Invoice Title
    doc.setFontSize(20);
    doc.text("INVOICE", 20, 60);
    
    // Invoice Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Invoice Header
    doc.text(`Invoice No: INV-${payment._id?.slice(-8) || "N/A"}`, 20, 75);
    doc.text(`Invoice Date: ${formatDateTime(payment.paid_at || payment.createdAt)}`, 20, 82);
    doc.text(`Due Date: ${formatDateTime(payment.paid_at || payment.createdAt)}`, 20, 89);
    
    // Billing Information
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, 105);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Customer: ${user?.name || "Customer"}`, 20, 115);
    doc.text(`Email: ${user?.email || "N/A"}`, 20, 122);
    doc.text(`Phone: ${user?.phone || "N/A"}`, 20, 129);
    
    // Simple table without autoTable
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 150);
    doc.text("Quantity", 100, 150);
    doc.text("Unit Price", 140, 150);
    doc.text("Total", 180, 150);
    
    doc.setFont("helvetica", "normal");
    doc.text("Car Rental Service", 20, 160);
    doc.text("1", 100, 160);
    doc.text(formatPrice(payment.amount || 0), 140, 160);
    doc.text(formatPrice(payment.amount || 0), 180, 160);
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 165, 190, 165);
    
    // Summary
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 20, 180);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ${formatPrice(payment.amount || 0)}`, 140, 180);
    doc.text(`Tax (0%): $0.00`, 140, 187);
    doc.text(`Total Amount: ${formatPrice(payment.amount || 0)}`, 140, 194);
    
    // Payment Status
    doc.setFont("helvetica", "bold");
    doc.text("Payment Status:", 20, 210);
    
    doc.setFont("helvetica", "normal");
    doc.text(payment.status?.toUpperCase() || "PENDING", 60, 210);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 105, 250, { align: 'center' });
    doc.text("DriveRent Car Rental - Premium Vehicle Solutions", 105, 257, { align: 'center' });
    
    // Open PDF in new tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    // Clean up URL after some time
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    
    Alert.success("Success", "Invoice opened in new tab!");
    
  } catch (error) {
    console.error("Error generating invoice:", error);
    Alert.error("Error", "Failed to generate invoice. Please try again.");
  }
};

  const handlePrint = (payment) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DriveRent Car Rental - Receipt</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { 
              background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              margin-bottom: 30px;
              border-radius: 10px;
            }
            .content { padding: 20px; }
            .section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .section-title { color: #1976d2; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #666; 
              font-size: 12px; 
              border-top: 2px solid #eee;
              padding-top: 20px;
            }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f5f5f5; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .amount { font-size: 24px; font-weight: bold; color: #1976d2; }
            .status-paid { color: #28a745; font-weight: bold; }
            .status-pending { color: #ffc107; font-weight: bold; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DriveRent Car Rental</h1>
          <h2>Official Payment Receipt</h2>
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">Receipt Information</div>
            <p><strong>Receipt No:</strong> ${payment._id?.slice(-8) || "N/A"}</p>
            <p><strong>Date:</strong> ${formatDateTime(payment.paid_at || payment.createdAt)}</p>
            <p><strong>Transaction ID:</strong> ${payment.transaction_id || "N/A"}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Customer Information</div>
            <p><strong>Name:</strong> ${user?.name || "Customer"}</p>
            <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${user?.phone || "N/A"}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Payment Details</div>
            <p class="amount">${formatPrice(payment.amount || 0)}</p>
            <p><strong>Payment Method:</strong> ${payment.payment_method || "N/A"}</p>
            <p><strong>Status:</strong> 
              <span class="status-${payment.status}">${payment.status?.toUpperCase() || "N/A"}</span>
            </p>
          </div>
          
          <div class="section">
            <div class="section-title">Booking Information</div>
            <p><strong>Car:</strong> ${payment.booking_id?.car_name || "Car Booking"}</p>
            <p><strong>Booking ID:</strong> ${payment.booking_id?._id || "N/A"}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing DriveRent Car Rental!</p>
          <p>For any inquiries, contact: support@driverent.com | Phone: +1 (555) 123-4567</p>
          <p>Printed on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-green-600",
          bg: "bg-gradient-to-r from-emerald-50 to-green-50",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Paid",
          badge: "bg-gradient-to-r from-emerald-500 to-green-600",
        };
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-500 to-orange-600",
          bg: "bg-gradient-to-r from-amber-50 to-orange-50",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
          badge: "bg-gradient-to-r from-amber-500 to-orange-600",
        };
      case "failed":
        return {
          color: "bg-gradient-to-r from-rose-500 to-red-600",
          bg: "bg-gradient-to-r from-rose-50 to-red-50",
          text: "text-rose-800",
          border: "border-rose-200",
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Failed",
          badge: "bg-gradient-to-r from-rose-500 to-red-600",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-600",
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Unknown",
          badge: "bg-gradient-to-r from-gray-500 to-slate-600",
        };
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 rounded-full animate-spin border-t-primary-600"></div>
            <CreditCard className="w-8 h-8 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">
            Loading your payments...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Preparing your payment history
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-400">
                My Payments
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage all your payment transactions
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchPayments}
                className="p-3 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 shadow-lg border border-primary-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(stats.total)}
                  </div>
                  <div className="text-sm text-gray-600">Total Paid</div>
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
                    {stats.paid}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
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
                    {stats.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {payments.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter Payments
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sort by payment status
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Showing {filteredPayments.length} of {payments.length} payments
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {["all", "paid", "pending", "failed"].map((f) => {
                const isActive = filter === f;
                const statusConfig = getStatusConfig(
                  f === "all" ? "paid" : f
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
                        <BadgeCheck className="w-4 h-4 ml-1 text-primary-500" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white to-primary-50 rounded-3xl shadow-xl border border-primary-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <CreditCard className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Payments Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any payments yet. Your payment history will appear here after completing bookings.
            </p>
            <button
              onClick={() => window.location.href = "/cars"}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Available Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPayments.map((payment) => {
              const statusConfig = getStatusConfig(payment.status);

              return (
                <div
                  key={payment._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Status Header */}
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
                            Transaction #{payment._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {/* <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* Payment Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Car Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">Booking Details</h4>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-gray-900">
                            {payment.booking_id?.car_name || "Car Booking"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Booking ID: {payment.booking_id?._id || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Transaction: {payment.transaction_id || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">Payment Info</h4>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            {formatPrice(payment.amount || 0)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Method: {payment.payment_method || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Currency: {payment.currency || "USD"}
                          </p>
                        </div>
                      </div>

                      {/* Date Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900">Date & Time</h4>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-medium text-gray-900">
                            {formatDateTime(payment.paid_at || payment.createdAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment Date
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => generateReceiptPDF(payment)}
                        className="flex-1 bg-gradient-to-r from-primary-50 to-white border border-primary-200 text-primary-700 px-4 py-3 rounded-xl font-semibold hover:border-primary-300 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>
                      
                      <button 
                        onClick={() => generateInvoicePDF(payment)}
                        className="flex-1 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-semibold hover:border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Invoice
                      </button>
                      
                      <button 
                        onClick={() => handlePrint(payment)}
                        className="flex-1 bg-gradient-to-r from-blue-50 to-white border border-blue-200 text-blue-700 px-4 py-3 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Details
                    </h2>
                    <p className="text-gray-600">ID: {selectedPayment._id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Amount Card */}
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <DollarSign className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Payment Amount
                        </h3>
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {formatPrice(selectedPayment.amount || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Payment Status</h4>
                      <div className="flex items-center gap-3">
                        {getStatusConfig(selectedPayment.status).icon}
                        <span className="font-bold text-lg">
                          {selectedPayment.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Payment Method</h4>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedPayment.payment_method || "N/A"}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Transaction ID</h4>
                      <p className="text-lg font-medium text-gray-900">
                        {selectedPayment.transaction_id || "N/A"}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold mb-3">Payment Date</h4>
                      <p className="text-lg font-medium text-gray-900">
                        {formatDateTime(selectedPayment.paid_at || selectedPayment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold mb-4">Booking Information</h4>
                    <div className="space-y-2">
                      <p className="text-gray-900">
                        <span className="font-medium">Car:</span>{" "}
                        {selectedPayment.booking_id?.car_name || "N/A"}
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">Booking ID:</span>{" "}
                        {selectedPayment.booking_id?._id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Document Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-semibold mb-4">Document Actions</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => {
                          generateReceiptPDF(selectedPayment);
                          setSelectedPayment(null);
                        }}
                        className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 text-primary-700 p-4 rounded-xl font-semibold hover:border-primary-300 transition-colors flex flex-col items-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        <span className="text-sm">Receipt PDF</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          generateInvoicePDF(selectedPayment);
                          setSelectedPayment(null);
                        }}
                        className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 p-4 rounded-xl font-semibold hover:border-emerald-300 transition-colors flex flex-col items-center gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">View Invoice</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          handlePrint(selectedPayment);
                          setSelectedPayment(null);
                        }}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 p-4 rounded-xl font-semibold hover:border-blue-300 transition-colors flex flex-col items-center gap-2"
                      >
                        <Printer className="w-5 h-5" />
                        <span className="text-sm">Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                  >
                    Close
                  </button>
                  
                  <button 
                    onClick={() => generateReceiptPDF(selectedPayment)}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Footer */}
        {payments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                Secure Payment Processing
              </span>
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-gray-600 text-sm text-center max-w-2xl mx-auto">
              All transactions are encrypted and secure. Your payment information is protected with industry-standard security measures.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}