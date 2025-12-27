"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Search,
  Filter,
  Mail,
  Calendar,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  UserCircle,
  AtSign,
  PhoneCall,
  Clock as ClockIcon,
  CreditCard,
  DollarSign,
  Edit,
  Download,
  FileText,
  Printer,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/priceCalc";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MySwal = withReactContent(Swal);

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [editingPayment, setEditingPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    amount: "",
    payment_method: "",
    notes: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc' // Default: ugu danbeeyay kor u soo maro
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchPayments();
  }, [user, router]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/payments", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      
      let paymentsArray = Array.isArray(data) ? data : (data.payments || []);
      
      // Ensure each payment has a createdAt/updatedAt field
      paymentsArray = paymentsArray.map(payment => ({
        ...payment,
        createdAt: payment.createdAt || payment.paid_at || new Date().toISOString(),
        updatedAt: payment.updatedAt || payment.paid_at || new Date().toISOString()
      }));
      
      // Sort by most recent first (descending order)
      paymentsArray.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.paid_at || a.date);
        const dateB = new Date(b.createdAt || b.paid_at || b.date);
        return dateB - dateA; // Most recent first
      });
      
      setPayments(paymentsArray);
    } catch (error) {
      console.error("Error fetching payments:", error);
      showErrorAlert("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  // Sort function
  const handleSort = (key) => {
    let direction = 'desc';
    
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedPayments = [...payments].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      
      // Handle nested properties
      if (key === 'user_name') {
        aValue = a.user_id?.name || a.user?.name || '';
        bValue = b.user_id?.name || b.user?.name || '';
      } else if (key === 'user_email') {
        aValue = a.user_id?.email || a.user?.email || '';
        bValue = b.user_id?.email || b.user?.email || '';
      } else if (key === 'booking_id') {
        aValue = a.booking_id?._id || '';
        bValue = b.booking_id?._id || '';
      } else if (key === 'date') {
        aValue = new Date(a.createdAt || a.paid_at || a.date);
        bValue = new Date(b.createdAt || b.paid_at || b.date);
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setPayments(sortedPayments);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 ml-1 text-blue-600" />
      : <ChevronDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  // PDF Generation Functions
  const generateReceiptPDF = (payment) => {
    try {
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
      const paymentUser = payment.user_id || payment.user || {};
      doc.text(`Receipt No: ${payment._id?.slice(-8) || "N/A"}`, 20, 75);
      doc.text(`Date: ${formatDateTime(payment.createdAt || payment.paid_at || payment.date)}`, 20, 82);
      doc.text(`Customer: ${paymentUser.name || paymentUser.email || "Customer"}`, 20, 89);
      doc.text(`Email: ${paymentUser.email || "N/A"}`, 20, 96);
      
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
      const booking = payment.booking_id || {};
      doc.setFont("helvetica", "bold");
      doc.text("BOOKING INFORMATION", 20, 165);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Car: ${booking.car_name || booking.carName || "Car Booking"}`, 20, 175);
      doc.text(`Booking ID: ${booking._id || "N/A"}`, 20, 182);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing DriveRent Car Rental!", 105, 250, { align: 'center' });
      doc.text("For any inquiries, contact: support@driverent.com", 105, 257, { align: 'center' });
      doc.text("Phone: +1 (555) 123-4567", 105, 264, { align: 'center' });
      
      // Save the PDF
      doc.save(`DriveRent_Receipt_${payment._id?.slice(-8)}.pdf`);
      
      showSuccessAlert("Success", "Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating receipt:", error);
      showErrorAlert("Failed to generate receipt");
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setEditForm({
      status: payment.status || "",
      amount: payment.amount || "",
      payment_method: payment.payment_method || "",
      notes: payment.notes || ""
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/payments/${editingPayment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update payment");
      
      // Update local state
      setPayments(prevPayments =>
        prevPayments.map(p =>
          p._id === editingPayment._id 
            ? { 
                ...p, 
                ...editForm, 
                updatedAt: new Date().toISOString(),
                createdAt: p.createdAt // Preserve original creation date
              }
            : p
        )
      );
      
      setEditingPayment(null);
      showSuccessAlert("Success", "Payment updated successfully!");
    } catch (error) {
      console.error("Error updating payment:", error);
      showErrorAlert("Failed to update payment");
    }
  };

  const handleDeletePayment = async (paymentId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "This payment will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:4000/api/payments/${paymentId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });

          if (!res.ok) throw new Error("Failed to delete payment");
          
          setPayments(prevPayments => prevPayments.filter(p => p._id !== paymentId));
          showSuccessAlert("Deleted", "Payment deleted successfully!");
        } catch (error) {
          console.error("Error deleting payment:", error);
          showErrorAlert("Failed to delete payment");
        }
      }
    });
  };

  const showPaymentDetails = (payment) => {
    const paymentUser = payment.user_id || payment.user || {};
    const booking = payment.booking_id || {};
    
    MySwal.fire({
      title: `<strong>Payment Details</strong>`,
      html: `
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <div class="text-xs text-blue-600 font-medium">Payment ID</div>
              <div class="text-sm font-semibold">${payment._id?.slice(-8) || "N/A"}</div>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <div class="text-xs text-green-600 font-medium">Amount</div>
              <div class="text-lg font-bold">${formatPrice(payment.amount || 0)}</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-500 font-medium">Customer Information</div>
              <div class="mt-1">
                <div class="text-sm"><strong>Name:</strong> ${paymentUser.name || "N/A"}</div>
                <div class="text-sm"><strong>Email:</strong> ${paymentUser.email || "N/A"}</div>
                ${paymentUser.phone ? `<div class="text-sm"><strong>Phone:</strong> ${paymentUser.phone}</div>` : ''}
              </div>
            </div>
            
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-500 font-medium">Payment Information</div>
              <div class="mt-1">
                <div class="text-sm"><strong>Method:</strong> ${payment.payment_method || "N/A"}</div>
                <div class="text-sm"><strong>Status:</strong> 
                  <span class="ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}">
                    ${payment.status?.toUpperCase() || "N/A"}
                  </span>
                </div>
                <div class="text-sm"><strong>Transaction ID:</strong> ${payment.transaction_id || "N/A"}</div>
                <div class="text-sm"><strong>Date:</strong> ${formatDateTime(payment.createdAt || payment.paid_at || payment.date)}</div>
              </div>
            </div>
            
            ${booking._id ? `
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="text-xs text-gray-500 font-medium">Booking Information</div>
                <div class="mt-1">
                  <div class="text-sm"><strong>Booking ID:</strong> ${booking._id}</div>
                  <div class="text-sm"><strong>Car:</strong> ${booking.car_name || booking.carName || "N/A"}</div>
                </div>
              </div>
            ` : ''}
            
            ${payment.notes ? `
              <div class="p-3 bg-yellow-50 rounded-lg">
                <div class="text-xs text-yellow-600 font-medium">Notes</div>
                <div class="mt-1 text-sm">${payment.notes}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      padding: '2rem',
      customClass: {
        popup: 'rounded-xl',
        closeButton: 'text-gray-400 hover:text-gray-600',
        title: 'text-xl font-bold text-gray-900 mb-0'
      }
    });
  };

  const showSuccessAlert = (title, text) => {
    MySwal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4f46e5',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (text) => {
    MySwal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Clock size={12} className="mr-1" /> Failed
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

  const getMethodBadge = (method) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Card</span>;
      case "cash":
        return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Cash</span>;
      case "evc":
        return <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">EVC</span>;
      case "paypal":
      default:
        return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">{method || "Unknown"}</span>;
    }
  };

  if (!user || user.role !== "admin") return null;

  const filteredPayments = payments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (payment._id || "").toLowerCase().includes(searchTermLower) ||
      ((payment.user_id?.name || payment.user?.name || "")?.toLowerCase().includes(searchTermLower)) ||
      ((payment.user_id?.email || payment.user?.email || "")?.toLowerCase().includes(searchTermLower)) ||
      ((payment.booking_id?._id || "")?.toLowerCase().includes(searchTermLower)) ||
      ((payment.payment_method || "")?.toLowerCase().includes(searchTermLower)) ||
      ((payment.transaction_id || "")?.toLowerCase().includes(searchTermLower));
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || payment.payment_method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate stats
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidCount = payments.filter(p => p.status === "paid").length;
  const pendingCount = payments.filter(p => p.status === "pending").length;
  const failedCount = payments.filter(p => p.status === "failed").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
                <p className="text-gray-600">
                  View and manage all payment transactions 
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    (Latest payments shown first)
                  </span>
                </p>
              </div>
              <button
                onClick={fetchPayments}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{formatPrice(totalAmount)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{paidCount}</div>
                  <div className="text-sm text-gray-600">Paid Payments</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  <div className="text-sm text-gray-600">Pending Payments</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CreditCard className="text-red-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                  <div className="text-sm text-gray-600">Failed Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search payments..."
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className="text-gray-500" />
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Methods</option>
                  <option value="credit_card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="evc">EVC</option>
                </select>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <CreditCard size={16} className="mr-2" />
                Showing {filteredPayments.length} of {payments.length} payments
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          Date
                          {getSortIcon('date')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('user_name')}
                      >
                        <div className="flex items-center">
                          Customer
                          {getSortIcon('user_name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center">
                          Amount & Method
                          {getSortIcon('amount')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment, index) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(payment.createdAt || payment.paid_at || payment.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(payment.createdAt || payment.paid_at || payment.date).split(',')[1]?.trim()}
                          </div>
                          {index === 0 && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                <Clock size={10} className="mr-1" /> Latest
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment._id?.slice(-8) || "N/A"}
                          </div>
                          {payment.transaction_id && (
                            <div className="text-xs text-gray-500">
                              TXN: {payment.transaction_id.slice(-8)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user_id?.name || payment.user?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.user_id?.email || payment.user?.email || "N/A"}
                          </div>
                          {payment.booking_id?._id && (
                            <div className="text-xs text-blue-600">
                              Booking: {payment.booking_id._id.slice(-8)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(payment.amount || 0)}
                          </div>
                          <div className="mt-1">
                            {getMethodBadge(payment.payment_method)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {getStatusBadge(payment.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => showPaymentDetails(payment)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit payment"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => generateReceiptPDF(payment)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Download receipt"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete payment"
                            >
                              <Trash2 size={18} />
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
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try a different search term" : "No payments received yet"}
                </p>
              </div>
            )}
          </div>

          {/* Sort Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="text-blue-600" size={20} />
                <span className="text-sm text-blue-800 font-medium">
                  Sort by: <span className="font-bold">{sortConfig.key === 'date' ? 'Date' : 
                    sortConfig.key === 'amount' ? 'Amount' : 
                    sortConfig.key === 'status' ? 'Status' : 
                    sortConfig.key === 'user_name' ? 'Customer' : 'Date'}</span>
                  {" "} ({sortConfig.direction === 'desc' ? 'Newest First' : 'Oldest First'})
                </span>
              </div>
              <button
                onClick={() => handleSort('date')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset to Date Sort
              </button>
            </div>
          </div>

          {/* Edit Payment Modal */}
          {editingPayment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Edit Payment</h2>
                      <p className="text-sm text-gray-600">
                        ID: {editingPayment._id?.slice(-8)}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingPayment(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        value={editForm.payment_method}
                        onChange={(e) => setEditForm({...editForm, payment_method: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Add any notes..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => setEditingPayment(null)}
                      className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                  <span>Paid payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                  <span>Pending payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                  <span>Failed payments</span>
                </div>
              </div>
              <div className="text-blue-600 font-medium">
                {payments.length > 0 && 
                  `Latest payment: ${formatDate(payments[0]?.createdAt || payments[0]?.paid_at || payments[0]?.date)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}