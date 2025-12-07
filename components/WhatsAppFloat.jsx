// components/WhatsAppFloat.jsx
"use client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);
  
  const phoneNumber = "612747828"; // Your WhatsApp number
  const message = "Hello! I need assistance with car rental from DriveRent.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center justify-center 
          bg-gradient-to-r from-green-500 to-green-600 
          text-white rounded-full shadow-xl 
          hover:shadow-2xl hover:scale-105 
          transition-all duration-300 overflow-hidden
          ${isHovered ? 'w-48 pr-4 pl-2' : 'w-14'}
          h-14
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white"></div>
          </div>
          
          {isHovered && (
            <div className="animate-fadeIn">
              <span className="text-sm font-semibold whitespace-nowrap">
                WhatsApp Support
              </span>
            </div>
          )}
        </div>
        
        {/* Pulsing effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      </a>
      
      {/* Tooltip for mobile */}
      <div className={`
        absolute right-16 bottom-1/2 translate-y-1/2 
        bg-gray-900 text-white text-sm px-3 py-2 rounded-lg 
        transition-opacity duration-300 pointer-events-none whitespace-nowrap
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}>
        Chat with us instantly!
        <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
      </div>
    </div>
  );
}