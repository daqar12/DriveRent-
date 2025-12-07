// components/WhatsAppChatPopup.jsx
"use client";
import { MessageCircle, X, Send, Phone, Check, CheckCheck, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const WhatsAppChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! 👋", sender: "bot", time: "10:00 AM", status: "read" },
    { id: 2, text: "I am Daqar from DriveRent. How can I assist you today?", sender: "bot", time: "10:01 AM", status: "read" },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const phoneNumber = "612747828";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");
    setTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      setTyping(false);
      const botResponses = [
        "thank you for reaching out! How can I help you?",
        "Sure! Could you please provide more details?",
        "I'm here to assist you with your car rental needs.",
        "Feel free to ask any questions you have about our services.",
        "Our team is dedicated to providing you with the best experience."  
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const newBotMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "read"
      };

      setMessages(prev => [...prev, newBotMessage]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([
        {
            id: 1, text: "Welcome! 👋", sender: "bot", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "read"
        },
        {
            id: 2, text: "I am Daqar from DriveRent. How can I assist you today?", sender: "bot", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "read"
        }
        ]);
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl, "_blank");
  };

  if (isMinimized) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-2xl px-4 py-3 hover:shadow-3xl hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          </div>
          <span className="font-medium">Chat with DriveRent</span>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed right-6 bottom-6 z-50 w-80 md:w-96">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-bold">DriveRent Support</h3>
                    <p className="text-xs text-green-100 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                      Online • answering in minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-white hover:bg-white/20 p-1 rounded"
                  >
                    <span className="text-xs">−</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* WhatsApp Number Display */}
              <div className="mt-3 pt-3 border-t border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-100">WhatsApp number:</p>
                    <p className=" text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                     {phoneNumber}
                    </p>
                  </div>
                  <button
                    onClick={openWhatsApp}
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    Chat on WhatsApp
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="h-96 bg-gray-50 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              <div className="text-center mb-4">
                <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  Today • {new Date().toLocaleDateString('so-SO')}
                </div>
              </div>

              {/* Messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-green-100 text-gray-800 rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.sender === "user" ? "text-green-600" : "text-gray-400"
                    }`}>
                      <span className="text-xs">{msg.time}</span>
                      {msg.sender === "user" && (
                        <>
                          {msg.status === "sent" && <Check className="w-3 h-3" />}
                          {msg.status === "read" && <CheckCheck className="w-3 h-3" />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct WhatsApp CTA */}
           

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="enter your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-full ${
                    message.trim()
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  } transition-colors`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
            
                <button
                  onClick={openWhatsApp}
                  className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                    Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 w-14 h-14 flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7" />
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              1
            </div>
            
            {/* Pulsing Effect */}
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            
            {/* Tooltip */}
            <div className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
             (WhatsApp: +252 {phoneNumber})
              <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
            </div>
          </button>
          
          {/* Small WhatsApp Link Button */}
          {/* <div className="absolute right-20 bottom-0">
            <button
              onClick={openWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              WhatsApp
            </button>
          </div> */}
        </div>
      )}

      {/* Optional: New Chat Button in Popup */}
      {isOpen && (
        <button
          onClick={startNewChat}
          className="fixed right-32 bottom-6 z-50 bg-white text-green-600 text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-green-50 transition-all flex items-center gap-2 border border-green-100"
        >
          <span>New Chat</span>
        </button>
      )}
    </>
  );
};

export default WhatsAppChatPopup;