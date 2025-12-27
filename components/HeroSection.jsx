// components/HeroSection.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Car } from "lucide-react";
import { Crown, Zap, Truck } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState({
    location: "",
    pickupDate: "",
    dropoffDate: "",
    carType: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/locations");
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();

    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    setSearch((prev) => ({
      ...prev,
      pickupDate: tomorrow.toISOString().split("T")[0],
      dropoffDate: dayAfter.toISOString().split("T")[0],
    }));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = new URLSearchParams();
    if (search.location) query.append("location", search.location);
    if (search.pickupDate) query.append("pickupDate", search.pickupDate);
    if (search.dropoffDate) query.append("dropoffDate", search.dropoffDate);
    if (search.carType) query.append("carType", search.carType);

    router.push(`/cars?${query.toString()}`);
  };

  const carTypes = [
    { label: "SUV", icon: Truck },
    { label: "Sedan", icon: Car },
    { label: "Luxury", icon: Crown },
    { label: "Electric", icon: Zap },
  ];

  if (!isMounted) {
    return (
      <section className="relative min-h-[80vh] flex items-center bg-primary-600 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="text-center">
            <div className="inline-block h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary-600">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary-500/20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="text-sm font-medium">
                 Premium Car Rental Service
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Drive Your Dream
              <span className="block text-primary-200 mt-2">Car Today</span>
            </h1>

            <p className="text-lg text-primary-50/60 mb-8 max-w-lg">
              Experience luxury and comfort with our wide selection of premium
              vehicles.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-accent-600">Premium Cars</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-accent-600">Locations</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-accent-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-secondary-600">
                  Find Your Perfect Ride
                </h3>
                <p className="text-secondary-500 mt-2">
                  Search from our premium collection
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-secondary-600 mb-2">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      Pickup Location
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select location"
                      value={search.location}
                      onChange={(e) =>
                        setSearch({ ...search, location: e.target.value })
                      }
                      list="locations"
                      className="w-full border border-secondary-500/30 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
                    <datalist id="locations">
                      {locations.map((loc, index) => (
                        <option key={loc.name + index} value={loc.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-600 mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                        Pickup Date
                      </span>
                    </label>
                    <input
                      type="date"
                      value={search.pickupDate}
                      onChange={(e) =>
                        setSearch({ ...search, pickupDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-secondary-500/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-600 mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                        Drop-off Date
                      </span>
                    </label>
                    <input
                      type="date"
                      value={search.dropoffDate}
                      onChange={(e) =>
                        setSearch({ ...search, dropoffDate: e.target.value })
                      }
                      min={search.pickupDate}
                      className="w-full border border-secondary-500/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Car Types */}
                <div>
                  <label className="block text-sm font-medium text-secondary-600 mb-3">
                    <span className="flex items-center">
                      <Car className="w-4 h-4 mr-2 text-primary-500" />
                      Car Type
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {carTypes.map((type) => {
                      const Icon = type.icon;

                      return (
                        <button
                          key={type.label}
                          type="button"
                          onClick={() =>
                            setSearch((prev) => ({
                              ...prev,
                              carType:
                                prev.carType === type.label ? "" : type.label,
                            }))
                          }
                          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                            search.carType === type.label
                              ? "bg-primary-500 text-white scale-105"
                              : "bg-secondary-500/10 text-secondary-600 hover:bg-secondary-500/20"
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg shadow-lg"
                >
                  Search Available Cars
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Add bounce animation if not in Tailwind */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
      `}</style>
    </section>
  );
}
