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
  Clock as ClockIcon
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchMessages();
  }, [user, router]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/contact");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      
      const messagesArray = Array.isArray(data) ? data : [];
      
      const formattedMessages = messagesArray.map((msg) => ({
        id: msg._id || msg.id,
        name: msg.name || "Anonymous",
        email: msg.email || "No email",
        phone: msg.phone || "No phone",
        message: msg.message || "No message",
        subject: msg.subject || "No subject",
        createdAt: msg.createdAt || msg.date || new Date().toISOString(),
        read: msg.read || false,
        status: msg.read ? "read" : "unread"
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showErrorAlert("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const showMessageAlert = (msg) => {
    MySwal.fire({
      title: `<strong>Message Details</strong>`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">${msg.name}</h3>
                <p class="text-sm text-gray-500">Sent ${formatDate(msg.createdAt)}</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span class="text-sm text-gray-700">${msg.email}</span>
            </div>
            
            ${msg.phone && msg.phone !== "No phone" ? `
              <div class="flex items-center p-3 bg-green-50 rounded-lg">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span class="text-sm text-gray-700">${msg.phone}</span>
              </div>
            ` : ''}
            
            ${msg.subject && msg.subject !== "No subject" ? `
              <div class="flex items-center p-3 bg-purple-50 rounded-lg">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-700">Subject: ${msg.subject}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="mt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Message:</h4>
            <div class="p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              <p class="text-gray-700 whitespace-pre-wrap">${msg.message}</p>
            </div>
          </div>
          
          <div class="mt-4 text-xs text-gray-500 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            Sent ${formatDate(msg.createdAt)}
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

  const showDeleteConfirm = (id, name) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `Delete message from ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteMessage(id);
      }
    });
  };

  const handleMarkAsRead = async (id) => {
    try {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, read: true, status: "read" } : msg
        )
      );

      showSuccessAlert("Success", "Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
      showErrorAlert("Failed to update message status");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, read: false, status: "unread" } : msg
        )
      );

      showSuccessAlert("Success", "Message marked as unread");
    } catch (error) {
      console.error("Error marking message as unread:", error);
      showErrorAlert("Failed to update message status");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      setMessages(messages.filter((msg) => msg.id !== id));
      showSuccessAlert("Deleted", "Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      showErrorAlert("Failed to delete message");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "read":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" /> Read
          </span>
        );
      case "unread":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> Unread
          </span>
        );
      default:
        return null;
    }
  };

  if (!user || user.role !== "admin") return null;

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600">View and manage customer inquiries and messages</p>
              </div>
              <button
                onClick={fetchMessages}
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
              <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">
                {messages.filter(m => !m.read).length}
              </div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.read).length}
              </div>
              <div className="text-sm text-gray-600">Read Messages</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(messages.map(m => m.email)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Senders</div>
            </div>
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
                  placeholder="Search messages..."
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
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <MessageSquare size={16} className="mr-2" />
                Showing {filteredMessages.length} of {messages.length} messages
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.map((msg) => (
                      <tr 
                        key={msg.id} 
                        className={`hover:bg-gray-50 ${!msg.read ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                              {/* {msg.subject && (
                                <div className="text-sm text-gray-500">{msg.subject}</div>
                              )} */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail size={14} className="text-gray-400" />
                            {msg.email}
                          </div>
                          {msg.phone && msg.phone !== "No phone" && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Phone size={14} className="text-gray-400" />
                              {msg.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {msg.message}
                          </div>
                          {msg.message.length > 100 && (
                            <div className="text-xs text-blue-600 mt-1">
                              Click to read full message
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex flex-col space-y-2">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1" />
                              {formatDate(msg.createdAt)}
                            </div>
                            {getStatusBadge(msg.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                          {!msg.read ? (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded flex items-center gap-1"
                              title="Mark as read"
                            >
                              <Eye size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsUnread(msg.id)}
                              className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded flex items-center gap-1"
                              title="Mark as unread"
                            >
                              <EyeOff size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => showMessageAlert(msg)}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                            title="View full message"
                          >
                            <MessageSquare size={18} />
                          </button>
                          {/* <button
                            onClick={() => showDeleteConfirm(msg.id, msg.name)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                            title="Delete message"
                          >
                            <Trash2 size={18} />
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try a different search term" : "No messages received yet"}
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
              <span>Blue background indicates unread messages</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span>Click on the message icon to view full details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}