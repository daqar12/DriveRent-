// app/contact/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  CheckCircle,
  Users,
  Shield,
  Headphones,
  HelpCircle,
  Car
} from "lucide-react";
import Head from "next/head";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:4000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Failed to send message. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      {/* Head for metadata */}
      <Head>
        <title>Contact Us - DriveRent</title>
        <meta 
          name="description" 
          content="Get in touch with DriveRent for car rental inquiries, support, and assistance" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <WhatsAppChatPopup />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Get in Touch with DriveRent</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Our team is here to help you with all your car rental needs. Reach out anytime - we're always ready to assist.
              </p>
            </div>
          </div>
        </div>

  

        {/* Main Content */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Contact Info */}
              <div className="space-y-8">
                {/* Get in Touch */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900"> Get in Touch</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Company Name</h3>
                      <p className="text-lg font-medium text-gray-900">DriveRent Car Rental</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Phone</h3>
                      <a href="tel:+252612747828" className="text-lg font-medium text-primary-600 hover:text-primary-700 transition">
                        +252 612 747 828
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Email</h3>
                      <a href="mailto:info@driverent.com" className="text-lg font-medium text-primary-600 hover:text-primary-700 transition">
                        info@driverent.com
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Location</h3>
                      <p className="text-lg text-gray-900">Mogadishu, Somalia</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-accent-100 text-accent-600 rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900"> Working Hours</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Saturday - Thursday</span>
                      <span className="font-semibold text-gray-900">8:00 AM – 8:00 PM</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Friday</span>
                      <span className="font-semibold text-gray-900">9:00 AM – 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900"> Send Us a Message</h2>
                      <p className="text-gray-600 mt-2">
                        Have a question or request? Fill out the contact form below and our team will get back to you as soon as possible.
                      </p>
                    </div>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-600">
                        Thank you for contacting DriveRent. We'll respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                          placeholder="+252 61 234 5678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                          placeholder="Type your message here..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                          isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 hover:shadow-lg'
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Message...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" />
                            Send Message
                          </span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Contact DriveRent Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-gray-50 to-primary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Car className="w-8 h-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-gray-900">Why Contact DriveRent?</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the benefits of choosing us for your car rental needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Customer Support</h3>
                <p className="text-gray-600">Quick responses and reliable assistance whenever you need it</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Booking Assistance</h3>
                <p className="text-gray-600">Help with reservations and modifications</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Rental Options</h3>
                <p className="text-gray-600">Tailored solutions for your specific needs</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable & Safe Vehicles</h3>
                <p className="text-gray-600">Well-maintained cars for your peace of mind</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Message */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 shadow-2xl text-white">
              <h2 className="text-3xl font-bold mb-6">We Look Forward to Serving You</h2>
              <p className="text-xl mb-8">
                Drive with confidence. Drive with DriveRent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+252612747828"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-lg text-lg flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
                
                <a
                  href="/cars"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:scale-105"
                >
                  Browse Cars
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}