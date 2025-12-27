// app/about/page.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaCar,
  FaShieldAlt,
  FaUserFriends,
  FaMapMarkerAlt,
  FaAward,
  FaHeart,
  FaStar,
  FaRoad,
  FaHandshake,
  FaLightbulb,
  FaRocket,
  FaCheckCircle,
  FaLeaf,
} from "react-icons/fa";
import {
  MdSpeed,
  MdSupportAgent,
  MdVerified,
  MdLocationCity,
  MdPriceCheck,
  MdAccessTimeFilled,
} from "react-icons/md";
import { GiCarKey, GiPathDistance } from "react-icons/gi";
import { TbArrowRight } from "react-icons/tb";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";

export const metadata = {
  title: "About Us - DriveRent",
  description:
    "Discover DriveRent's mission to provide stress-free car rental experiences with premium vehicles and exceptional service",
};

export default function AboutPage() {
  const features = [
    {
      icon: <FaCar className="text-3xl" />,
      title: "Premium Fleet",
      desc: "Curated selection of modern, clean, and reliable vehicles for every need.",
      gradient: "from-blue-500 to-cyan-400",
      bgColor: "bg-gradient-to-br from-primary-500 to-primary-400",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Safe & Insured",
      desc: "Comprehensive insurance and 24/7 roadside assistance for peace of mind.",
      gradient: "from-emerald-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-400",
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: "Customer First",
      desc: "Personalized service from a team that truly cares about your experience.",
      gradient: "from-amber-500 to-orange-400",
      bgColor: "bg-gradient-to-br from-accent-500 to-accent-400",
    },
    {
      icon: <MdLocationCity className="text-3xl" />,
      title: "Nationwide",
      desc: "Multiple convenient pickup locations across major cities and airports.",
      gradient: "from-purple-500 to-pink-400",
      bgColor: "bg-gradient-to-br from-primary-600 to-primary-400",
    },
  ];

  const stats = [
    {
      number: "5,000+",
      label: "Happy Customers",
      icon: <FaUserFriends className="text-2xl" />,
    },
    {
      number: "200+",
      label: "Vehicles Available",
      icon: <FaCar className="text-2xl" />,
    },
    {
      number: "15+",
      label: "Cities Covered",
      icon: <MdLocationCity className="text-2xl" />,
    },
    {
      number: "24/7",
      label: "Support",
      icon: <MdSupportAgent className="text-2xl" />,
    },
  ];

  const values = [
    {
      icon: <MdPriceCheck className="text-2xl" />,
      title: "Transparency",
      desc: "Clear pricing with no hidden fees or surprises",
    },
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "Reliability",
      desc: "Well-maintained vehicles you can always count on",
    },
    {
      icon: <MdAccessTimeFilled className="text-2xl" />,
      title: "Flexibility",
      desc: "Rental options that adapt to your schedule",
    },
    {
      icon: <FaHeart className="text-2xl" />,
      title: "Excellence",
      desc: "Going above and beyond in every interaction",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <Navbar />
      <WhatsAppChatPopup />

      {/* HERO SECTION - Modern Design */}
      <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <FaStar className="text-yellow-400" />
              <span className="text-sm font-medium">
                Your Trusted Car Rental Partner
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-6">Drive With Confidence</h1>

            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              We provide reliable, well-maintained vehicles to help you move
              comfortably and confidently—whether for business, travel, or daily
              needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/cars"
                className="group px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                <span>Book Your Ride</span>
                <TbArrowRight className="group-hover:translate-x-2 transition-transform" />
              </a>

              <a
                href="#why-choose-us"
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                Discover More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION STATEMENT */}
      <section id="why-choose-us" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission Content */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary-600 mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Our Philosophy
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Simple Goal,{" "}
                <span className="text-primary-600">Exceptional</span> Experience
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  At DriveRent, we believe renting a car should be stress-free.
                  That's why we've built our entire service around three core
                  principles:
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: <GiCarKey className="text-primary-600" />,
                      text: "Easy, intuitive booking process",
                    },
                    {
                      icon: <MdPriceCheck className="text-primary-600" />,
                      text: "Fair, transparent pricing with no hidden costs",
                    },
                    {
                      icon: <FaUserFriends className="text-primary-600" />,
                      text: "Excellent customer service available when you need it",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-primary-50 rounded-lg mt-1">
                        {item.icon}
                      </div>
                      <p className="text-gray-700 flex-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Assurance Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900 to-secondary-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/30 to-transparent rounded-bl-full" />

                <div className="p-10 text-white">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-300">
                        Quality Promise
                      </h3>
                      <h2 className="text-2xl font-bold">
                        Every Car Inspected
                      </h2>
                    </div>
                  </div>

                  <p className="text-primary-100 leading-relaxed mb-6">
                    Every vehicle in our fleet undergoes rigorous inspection to
                    ensure:
                  </p>

                  <div className="space-y-4">
                    {[
                      "Safety standards compliance",
                      "Optimal comfort features",
                      "Top performance maintenance",
                      "Complete cleanliness",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent-500 rounded-full" />
                        <span className="text-primary-200">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-primary-300">
                        Ready for your journey
                      </div>
                      <GiPathDistance className="text-3xl text-accent-500/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The <span className="text-primary-600">DriveRent</span> Advantage
            </h2>
            <p className="text-lg text-gray-600">
              Experience car rental reimagined with our unique combination of
              technology, service, and commitment to your satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-accent-300 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div
                    className={`${feature.bgColor} inline-flex p-4 rounded-xl text-white mb-6 transform group-hover:scale-110 transition duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700 transition flex items-center gap-2">
                      Explore feature{" "}
                      <TbArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-primary-600 mb-6">
              <div className="w-12 h-1 bg-primary-500 rounded-full" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Our Commitment
              </span>
              <div className="w-12 h-1 bg-primary-500 rounded-full" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built on <span className="text-primary-600">Values</span> That
              Drive Us
            </h2>
            <p className="text-lg text-gray-600">
              These principles guide every decision we make and every service we
              provide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl">
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-secondary-900 via-secondary-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-2xl mb-8 transform group-hover:rotate-12 transition duration-500">
                  <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-lg font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      {/* <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-700" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
            
            <div className="relative text-center py-20 px-8">
              <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
                <FaRocket className="text-4xl text-white" />
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Your Journey Starts With Us
              </h2>
              
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience the perfect blend of convenience, quality, and care. Join thousands 
                of satisfied customers who choose DriveRent for their mobility needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a 
                  href="/cars" 
                  className="group relative px-12 py-5 bg-white text-primary-700 font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Your Booking
                    <TbArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                
                <a 
                  href="/contact" 
                  className="group px-12 py-5 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 flex items-center gap-3"
                >
                  <MdSupportAgent className="group-hover:animate-bounce" />
                  <span>Get Support</span>
                </a>
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/20">
                <p className="text-primary-100">
                  Ready to drive? Call us at{" "}
                  <span className="font-bold text-white text-lg">+252 61 274 7828</span>
                </p>
                <p className="text-primary-200/80 text-sm mt-2">
                  We're here to help you 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
