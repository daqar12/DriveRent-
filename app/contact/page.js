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
  Headphones
} from "lucide-react";
import Head from "next/head";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      details: "+252 612 747 828",
      subtitle: "Available 24/7",
      color: "bg-primary-100 text-primary-600",
      action: "tel:+252612747828"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      details: "support@driverent.so",
      subtitle: "Response within 2 hours",
      color: "bg-accent-100 text-accent-600",
      action: "mailto:support@driverent.so"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Location",
      details: "Mogadishu, Somalia",
      subtitle: "Multiple branches available",
      color: "bg-secondary-100 text-secondary-600",
      action: "#"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "24/7 Available",
      subtitle: "Emergency support included",
      color: "bg-primary-50 text-primary-700",
      action: "#"
    },
  ];

  const supportAreas = [
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Booking Assistance",
      desc: "Help with reservations and modifications"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Insurance & Safety",
      desc: "Questions about coverage and safety"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Corporate Services",
      desc: "Business and fleet rental inquiries"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "General Inquiries",
      desc: "All other questions and feedback"
    }
  ];

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
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
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
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-400/5 to-transparent" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-300/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-600 mb-6">
                Get in <span className="text-primary-600">Touch</span> with DriveRent
              </h1>
              <p className="text-xl text-secondary-500">
                Our team is here to help you with all your car rental needs. 
                Reach out anytime - we're always ready to assist.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className={`${method.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/50 rounded-xl">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                      <p className="font-bold text-xl mb-1">{method.details}</p>
                      <p className="text-sm opacity-80">{method.subtitle}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-700">Send us a Message</h2>
                    <p className="text-secondary-500">We'll get back to you promptly</p>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-secondary-700 mb-2">Message Sent Successfully!</h3>
                    <p className="text-secondary-500">
                      Thank you for contacting DriveRent. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        >
                          <option value="">Select a subject</option>
                          <option value="booking">Booking Assistance</option>
                          <option value="insurance">Insurance Questions</option>
                          <option value="corporate">Corporate Services</option>
                          <option value="support">Technical Support</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                        placeholder="How can we help you today?"
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

              {/* Support Areas & Info */}
              <div className="space-y-8">
                {/* Support Areas */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-secondary-700 mb-6">
                    How Can We Help You?
                  </h3>
                  <div className="space-y-4">
                    {supportAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-colors"
                      >
                        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                          {area.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-secondary-700">{area.title}</h4>
                          <p className="text-secondary-500 text-sm mt-1">{area.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-accent-100 text-accent-600 rounded-xl">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary-700">Emergency Roadside Assistance</h3>
                      <p className="text-secondary-500">Available 24/7 for all customers</p>
                    </div>
                  </div>
                  
                  <a
                    href="tel:+252612747828"
                    className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4"
                  >
                    Call Now: +252 612 747 828
                  </a>
                  
                  <p className="text-secondary-600 text-sm text-center">
                    For breakdowns, accidents, or urgent assistance while on the road
                  </p>
                </div>

                {/* Response Time Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-secondary-700">Our Response Time</h3>
                      <p className="text-secondary-500">We're committed to quick responses</p>
                    </div>
                    <Clock className="w-6 h-6 text-primary-500" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-secondary-600">Phone Calls</span>
                      <span className="font-semibold text-primary-600">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-secondary-600">WhatsApp Messages</span>
                      <span className="font-semibold text-primary-600">Within 10 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Email Responses</span>
                      <span className="font-semibold text-primary-600">Within 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 px-6 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Quick answers to common questions about our car rental services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">What documents do I need to rent a car?</h3>
                <p className="text-gray-300">
                  You'll need a valid driver's license, national ID or passport, and a credit card for the security deposit.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Is there 24/7 customer support?</h3>
                <p className="text-gray-300">
                  Yes! Our support team is available 24/7 via phone, WhatsApp, and email for all your needs.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Can I modify or cancel my booking?</h3>
                <p className="text-gray-300">
                  Absolutely! You can modify or cancel your booking up to 24 hours before pickup without any fees.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">What's included in the rental price?</h3>
                <p className="text-gray-300">
                  Our rental price includes comprehensive insurance, unlimited mileage, and 24/7 roadside assistance.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <a
                href="/faq"
                className="inline-flex items-center gap-2 bg-white text-secondary-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View All FAQs
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Hit the Road?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                Contact us today and experience the DriveRent difference. 
                Premium cars, exceptional service, and peace of mind.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+252612747828"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-lg text-lg flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </a>
                
                <a
                  href="/cars"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:scale-105"
                >
                  Browse Available Cars
                </a>
              </div>
              
              <div className="mt-10 pt-8 border-t border-primary-400">
                <p className="text-primary-200 text-sm">
                  <strong>Quick Connect:</strong> Save our number: +252 612 747 828
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}