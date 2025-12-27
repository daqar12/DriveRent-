// app/dashboard/cars/page.js - Updated with Modal
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import AddCarModal from "@/components/AddCarModal";
import Alert from "@/components/Alert";
import EditCarModal from "@/components/EditCarModal";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Car as CarIcon,
  Fuel,
  Settings,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  X,
  Zap,
  MapPin,
  DollarSign,
  Download,
} from "lucide-react";
import { formatPrice } from "@/utils/priceCalc";
import { getMockCars } from "@/data/mockCars";

// Car Details Modal Component
function CarDetailsModal({ car, isOpen, onClose }) {
  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{car.name}</h3>
                <p className="text-gray-600">
                  {car.brand} • {car.model} • {car.year}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Car Images */}
              <div>
                <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={car.images || "/cars/default-car.jpg"}
                    alt={car.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg h-20">
                      <img
                        src={car.images || "/cars/default-car.jpg"}
                        alt={`${car.name} ${i}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Car Details */}
              <div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        ${car.pricePerDay}
                        <span className="text-lg font-normal text-gray-500">
                          /day
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Base rental price
                      </div>
                    </div>
                    <div
                      className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${
                        car.status === "available"
                          ? "bg-green-100 text-green-800"
                          : car.status === "rented"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                    >
                      {car.status === "available"
                        ? "Available"
                        : car.status === "rented"
                        ? "Rented"
                        : "Maintenance"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">
                        {car.location || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">{car.year}</span>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Fuel size={18} className="text-blue-500 mr-2" />
                      <span className="font-medium">Fuel Type</span>
                    </div>
                    <div className="text-gray-700">
                      {car.fuelType || "Petrol"}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Settings size={18} className="text-blue-500 mr-2" />
                      <span className="font-medium">Transmission</span>
                    </div>
                    <div className="text-gray-700">
                      {car.transmission || "Automatic"}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <UsersIcon size={18} className="text-blue-500 mr-2" />
                      <span className="font-medium">Seats</span>
                    </div>
                    <div className="text-gray-700">{car.seats || 4} seats</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Car Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Car ID:</span>
                      <span className="font-medium">{car._id || car.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Added Date:</span>
                      <span className="font-medium">
                        {car.createdAt
                          ? new Date(car.createdAt).toLocaleDateString()
                          : "Not available"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {car.updatedAt
                          ? new Date(car.updatedAt).toLocaleDateString()
                          : "Not available"}
                      </span>
                    </div>
                    {car.features && car.features.length > 0 && (
                      <div>
                        <span className="text-gray-600">Features:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {car.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCarsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ───────── FETCH CARS ─────────
  // ───────── FETCH CARS ─────────
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:4000/api/cars");
      if (!res.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await res.json();

      // Set cars and filteredCars
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setCars([]);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  };

  // ───────── DELETE CAR ─────────
  const handleDeleteCar = async (id) => {
    const isConfirmed = await Alert.confirm(
      "Are you sure?",
      "This car will be deleted permanently!"
    );

    if (!isConfirmed) return;

    const updated = cars.filter((car) => car.id !== id);
    setCars(updated);
    setFilteredCars(updated);

    Alert.success("Deleted!", "Car has been removed successfully.");
  };

  // ───────── CHANGE STATUS ─────────
  const handleStatusChange = (id, status) => {
    const updated = cars.map((car) =>
      car.id === id ? { ...car, status } : car
    );
    setCars(updated);
    setFilteredCars(updated);
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };

  // ───────── FILTER + SEARCH ─────────
  useEffect(() => {
    let data = [...cars];

    // Search
    if (searchTerm.trim() !== "") {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Status filter
    if (filterStatus !== "all") {
      data = data.filter((c) => c.status === filterStatus);
    }

    setFilteredCars(data);
  }, [searchTerm, filterStatus, cars]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200">
            <CheckCircle size={12} className="mr-1" />
            Available
          </span>
        );
      case "rented":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200">
            <Eye size={12} className="mr-1" />
            Rented
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200">
            <Settings size={12} className="mr-1" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200">
            Unknown
          </span>
        );
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <AdminSidebar />

        <div className="ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 mb-8 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Car Management</h1>
                  <p className="text-blue-100 opacity-90">
                    Manage your premium fleet of rental cars
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
                >
                  <Plus size={20} />
                  <span>Add New Car</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {cars.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Cars</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <CarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {cars.filter((c) => c.status === "available").length}
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-500">
                      {cars.filter((c) => c.status === "rented").length}
                    </div>
                    <div className="text-sm text-gray-600">Rented</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {cars.filter((c) => c.status === "maintenance").length}
                    </div>
                    <div className="text-sm text-gray-600">Maintenance</div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Settings className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-4">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specifications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location & Price
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
                    {filteredCars.map((car) => (
                      <tr key={car._id || car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={
                                  Array.isArray(car.images)
                                    ? car.images[0] || "/cars/default-car.jpg"
                                    : car.images || "/cars/default-car.jpg"
                                }
                                alt={car.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {car._id
                                  ? `CAR-${car._id.substring(0, 8)}`
                                  : car.id
                                  ? `CAR-${car.id}`
                                  : "No ID"}
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {car.name || "Unnamed Car"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {car.brand || "Unknown"} •{" "}
                                {car.model || "Unknown"} • {car.year || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700">
                              <Fuel size={14} className="text-gray-400 mr-2" />
                              {car.fuelType || "Petrol"}
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <Settings
                                size={14}
                                className="text-gray-400 mr-2"
                              />
                              {car.transmission || "Automatic"}
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <UsersIcon
                                size={14}
                                className="text-gray-400 mr-2"
                              />
                              {car.seats || 4} seats
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-2">
                              <MapPin
                                size={14}
                                className="text-gray-400 mr-2"
                              />
                              {car.location || "Location not specified"}
                            </div>
                            <div className="flex items-center">
                              <DollarSign
                                size={14}
                                className="text-gray-400 mr-2"
                              />
                              <span className="text-lg font-bold text-blue-600">
                                ${car.pricePerDay || 0}
                                <span className="text-sm font-normal text-gray-500">
                                  /day
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            {getStatusBadge(car.status)}
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {car._id || car.id || "No ID"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCar(car);
                                setShowEditModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>

                            {/* <button
                              onClick={() => handleDeleteCar(car._id || car.id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button> */}
                            <button
                              onClick={() => handleViewDetails(car)}
                              className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {/* <select
                              value={car.status || "available"}
                              onChange={(e) =>
                                handleStatusChange(
                                  car._id || car.id,
                                  e.target.value
                                )
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="available">Available</option>
                              <option value="rented">Rented</option>
                              <option value="maintenance">Maintenance</option>
                            </select> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No cars found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "Get started by adding your first car"}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
                >
                  <Plus size={18} />
                  <span>Add First Car</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditCarModal
        car={selectedCar}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(updatedCar) => {
          const updatedCars = cars.map((c) =>
            c._id === updatedCar._id ? updatedCar : c
          );
          setCars(updatedCars);
          setFilteredCars(updatedCars);
        }}
      />

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCar}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
}
