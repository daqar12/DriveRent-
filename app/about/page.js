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
  FaRocket
} from "react-icons/fa";
import { 
  MdSpeed, 
  MdSupportAgent, 
  MdVerified, 
  MdLocationCity 
} from "react-icons/md";
import { GiCarKey } from "react-icons/gi";
import WhatsAppChatPopup from "@/components/WhatsAppChatPopup";

export const metadata = {
  title: "About Us - DriveRent",
  description: "Learn about DriveRent, our mission, and our founder Mohamed Dahir Abdullahi",
};

export default function AboutPage() {
  const features = [
    {
      icon: <FaCar className="text-3xl" />,
      title: "Premium Fleet",
      desc: "Curated selection of modern, clean, and reliable vehicles for every need.",
      gradient: "from-blue-500 to-cyan-400",
      bgColor: "bg-gradient-to-br from-primary-500 to-primary-400"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Safe & Insured",
      desc: "Comprehensive insurance and 24/7 roadside assistance for peace of mind.",
      gradient: "from-emerald-500 to-teal-400",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-400"
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: "Customer First",
      desc: "Personalized service from a team that truly cares about your experience.",
      gradient: "from-amber-500 to-orange-400",
      bgColor: "bg-gradient-to-br from-accent-500 to-accent-400"
    },
    {
      icon: <MdLocationCity className="text-3xl" />,
      title: "Nationwide",
      desc: "Multiple convenient pickup locations across major cities and airports.",
      gradient: "from-purple-500 to-pink-400",
      bgColor: "bg-gradient-to-br from-primary-600 to-primary-400"
    },
  ];

  const stats = [
    { 
      number: "5,000+", 
      label: "Happy Customers",
      icon: <FaUserFriends className="text-2xl" />
    },
    { 
      number: "200+", 
      label: "Vehicles Available",
      icon: <FaCar className="text-2xl" />
    },
    { 
      number: "15+", 
      label: "Cities Covered",
      icon: <MdLocationCity className="text-2xl" />
    },
    { 
      number: "24/7", 
      label: "Support",
      icon: <MdSupportAgent className="text-2xl" />
    },
  ];

  const values = [
    {
      icon: <MdVerified className="text-2xl" />,
      title: "Integrity",
      desc: "Transparent pricing, no hidden fees, honest service"
    },
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "Trust",
      desc: "Building lasting relationships through reliability"
    },
    {
      icon: <FaLightbulb className="text-2xl" />,
      title: "Innovation",
      desc: "Leveraging technology for seamless experiences"
    },
    {
      icon: <FaHeart className="text-2xl" />,
      title: "Care",
      desc: "Going above and beyond for every customer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white">
      <Navbar />
      <WhatsAppChatPopup />


      {/* HERO SECTION - Enhanced */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-primary-400/5 to-transparent" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-300/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaStar className="text-yellow-500" />
            Trusted Since 2020
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Driving <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-50">Excellence</span> in Mobility
          </h1>
          
          <p className="text-xl text-white-600 max-w-3xl mx-auto leading-relaxed">
            At DriveRent, we're not just renting cars - we're creating experiences. 
            Founded by Mohamed Dahir Abdullahi, we combine innovation with passion 
            to redefine what car rental should be.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a href="/cars" className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-200 transition-all duration-300 hover:-translate-y-1">
              Explore Our Fleet
              <GiCarKey className="inline ml-2 group-hover:rotate-12 transition-transform" />
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-primary-200 text-black-700 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-700 transition-all duration-300">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION - Modern Card Design */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Founder Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-500 to-transparent rounded-bl-full" />
                
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl text-white">
                      <FaAward className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Founder & Visionary</h3>
                      <h2 className="text-2xl font-bold text-gray-900">Mohamed Dahir Abdullahi</h2>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    With a vision to transform mobility in the region, Mohamed founded DriveRent 
                    on the principles of transparency, reliability, and customer-centric innovation. 
                    His leadership has driven our growth from a single location to a nationwide network.
                  </p>
                  
                  <div className="flex items-center gap-3 text-gray-500">
                    <FaRoad className="text-primary-500" />
                    <span className="text-sm">Pioneering accessible mobility solutions</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-primary-50 p-6 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaStar className="text-yellow-500" />
                      <span>Industry Leader</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaHeart className="text-red-500" />
                      <span>Customer Advocate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary-700 mb-6">
                <div className="w-12 h-0.5 bg-primary-500" />
                <span className="text-sm font-semibold uppercase tracking-wider">Our Promise</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Redefining <span className="text-primary-600">Car Rental</span> Through Innovation & Care
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-8">
                We believe every journey deserves to be exceptional. That's why we've built DriveRent 
                around cutting-edge technology, premium vehicles, and a team that genuinely cares about 
                your experience from booking to return.
              </p>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{value.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - Enhanced Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The <span className="text-primary-600">DriveRent</span> Difference
            </h2>
            <p className="text-lg text-gray-600">
              Experience car rental reimagined with our unique combination of technology, 
              service, and quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-accent-300 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`${feature.bgColor} inline-flex p-4 rounded-xl text-white mb-6 transform group-hover:scale-110 transition duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700 transition">
                      Learn more →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS - Animated */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl mb-6 transform group-hover:rotate-12 transition duration-300">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Modern Gradient */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-700" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
            
            <div className="relative text-center py-16 px-8">
              <FaRocket className="text-5xl text-white mb-6 mx-auto opacity-80" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Drive Your Next Adventure?
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                Join thousands who've discovered the perfect blend of convenience, 
                quality, and care with DriveRent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/cars" 
                  className="group relative px-10 py-4 bg-white text-primary-700 font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Browse Vehicles</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                
                <a 
                  href="/contact" 
                  className="group px-10 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Contact Team
                    <MdSupportAgent className="group-hover:animate-bounce" />
                  </span>
                </a>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-primary-100">
                  Need assistance? Call us at{" "}
                  <span className="font-semibold text-white">+252 61 274 7828</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}