// app/page.js
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Search, Shield, Clock, Award, Star, ChevronRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { getMockCars } from "@/data/mockCars";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";
import Testimonials from "@/components/Testimonials";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    comment: "Excellent service! The car was clean and well-maintained.",
    rating: 5,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    comment: "Smooth booking process and great customer support.",
    rating: 4,
    date: "2024-01-10",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState({
    location: "",
    pickupDate: "",
    dropoffDate: "",
  });

  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setFeaturedLoading(true);

        const res = await fetch("http://127.0.0.1:4000/api/cars");
        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();

        // Filter cars with rating >= 4.8
        const highRated = data.filter((car) => car.rating >= 4.8);

        // Sort by rating descending
        const sorted = highRated.sort((a, b) => b.rating - a.rating);

        // Pick top 3 featured cars
        setFeaturedCars(sorted.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured cars:", error);
        setFeaturedCars([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedCars(); // ✅ Call only inside useEffect
  }, []); // ✅ Empty dependency array to run onc

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    console.log("Search:", search);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* WhatsApp Floating Button - RIGHT SIDE */}
      <WhatsAppChatPopup />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Cars
              </h2>
              <p className="text-gray-600">Most popular choices for rent</p>
            </div>
            <a
              href="/cars"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center group transition-colors"
            >
              View All Cars
              <ChevronRight
                size={20}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-2xl p-4 animate-pulse"
                >
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-8 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No featured cars available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DriveRent
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best car rental experience with premium service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-colors duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Insured</h3>
              <p className="text-gray-600">
                All vehicles are fully insured for your peace of mind
              </p>
            </div>

            <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-colors duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support for any assistance
              </p>
            </div>

            <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-colors duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Award className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All cars are regularly serviced and maintained
              </p>
            </div>

            <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-colors duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Star className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive prices with no hidden charges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <Testimonials />
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6">
            <Star className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust DriveRent for their
            car rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/cars"
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg shadow-lg"
            >
              Book Your Car Now
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Contact Us
            </a>
          </div>
          <p className="text-gray-400 mt-8 text-sm">
            Need help? Use the WhatsApp button to chat instantly!
          </p>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
