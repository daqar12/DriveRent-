"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilter from "@/components/CarFilter";
import {
  Grid,
  List,
  ChevronDown,
  Sparkles,
  Shield,
  Clock,
  Award,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";

export default function CarsPage() {
  const searchParams = useSearchParams();
  const locationFilter = searchParams?.get("location") || "";
  const carTypeFilter = searchParams?.get("carType") || "";
  const pickupDate = searchParams?.get("pickupDate") || "";
  const dropoffDate = searchParams?.get("dropoffDate") || "";

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("price-low");

  useEffect(() => {
    fetchCars();
  }, [locationFilter, carTypeFilter]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:4000/api/cars");
      const data = await res.json();

      let filtered = [...data];

      if (locationFilter) {
        filtered.sort((a, b) => {
          if (a.location === locationFilter && b.location !== locationFilter)
            return -1;
          if (b.location === locationFilter && a.location !== locationFilter)
            return 1;
          return 0;
        });
      }

      if (carTypeFilter) {
        filtered = filtered.filter((car) => car.carType === carTypeFilter);
      }

      setCars(data);
      setFilteredCars(filtered);
    } catch (err) {
      console.error(err);
      setCars([]);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setFilteredCars(sortCars(filteredCars, value));
  };

  const sortCars = (carsList, sortOption) => {
    const sorted = [...carsList];
    switch (sortOption) {
      case "price-low":
        return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case "price-high":
        return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const handleFilter = (filters) => {
    let result = [...cars];

    if (filters.brand)
      result = result.filter((car) =>
        car.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    if (filters.model)
      result = result.filter(
        (car) =>
          car.model?.toLowerCase().includes(filters.model.toLowerCase()) ||
          car.name?.toLowerCase().includes(filters.model.toLowerCase())
      );
    if (filters.fuelType)
      result = result.filter((car) => car.fuelType === filters.fuelType);
    if (filters.transmission)
      result = result.filter(
        (car) => car.transmission === filters.transmission
      );
    if (filters.seats)
      result = result.filter((car) => car.seats >= parseInt(filters.seats));
    if (filters.minPrice)
      result = result.filter(
        (car) => car.pricePerDay >= parseFloat(filters.minPrice)
      );
    if (filters.maxPrice)
      result = result.filter(
        (car) => car.pricePerDay <= parseFloat(filters.maxPrice)
      );

    result = sortCars(result, sortBy);
    setFilteredCars(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <WhatsAppChatPopup />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Choose from our premium collection of luxury and economy vehicles
          </p>
        </div>
      </div>

      {/* Cars Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Filter + Sorting */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Cars{" "}
                <span className="text-blue-600">{filteredCars.length}</span>
              </h2>
              <p className="text-gray-600">
                Filter and sort to find your perfect vehicle
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid" ? "bg-white shadow" : ""
                  }`}
                >
                  <Grid
                    size={20}
                    className={viewMode === "grid" ? "text-blue-600" : "text-gray-500"}
                  />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list" ? "bg-white shadow" : ""
                  }`}
                >
                  <List
                    size={20}
                    className={viewMode === "list" ? "text-blue-600" : "text-gray-500"}
                  />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <CarFilter onFilter={handleFilter} />
        </div>

        {/* Cars Grid/List */}
        <div className="mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading premium vehicles...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }`}
            >
              {filteredCars.map((car, index) => (
                <div
                  key={car._id || index}
                  className={viewMode === "list" ? "bg-white rounded-2xl shadow-lg p-6 border border-gray-100" : ""}
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6">
                <Sparkles className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No matching cars found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your filters or browse our entire collection
              </p>
              <button
                onClick={() => handleFilter({})}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Why Choose Us Section */}
        <section className="py-12 mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DriveRent</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best car rental experience with premium service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Insured</h3>
              <p className="text-gray-600 text-sm">All vehicles are fully insured for your peace of mind</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer support for any assistance</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">All cars are regularly serviced and maintained</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">Competitive prices with no hidden charges</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
