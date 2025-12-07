// components/WhatsAppFloatAdvanced.jsx
"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

const WhatsAppFloatAdvanced = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [responseTime, setResponseTime] = useState(2); // Mock response time
  const phoneNumber = "612747828";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Simulate typing effect for response time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (responseTime > 0) {
        setResponseTime(prev => prev - 0.1);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [responseTime]);

  // Hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {isExpanded ? (
        // Expanded Card View
        <div className="bg-white rounded-xl shadow-2xl w-72 animate-slide-in-right">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp Support</h3>
                  <p className="text-xs text-green-600">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-gray-600">
                <p>Get instant help with:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Booking assistance</li>
                  <li>Car selection</li>
                  <li>Price inquiries</li>
                  <li>Emergency support</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average response time:</p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(2 - responseTime) / 2 * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {responseTime.toFixed(1)} min
                  </span>
                </div>
              </div>
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Start Chat
            </a>
          </div>
        </div>
      ) : (
        // Compact Floating Button
        <div className="relative group">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
          
          {/* Tooltip */}
          <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Need help? Chat with us!
            <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
          </div>
          
          {/* Pulsing effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppFloatAdvanced;