// components/Navbar.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, User, LogOut, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false); // Light/Dark toggle

  const handleLogout = () => {
    if (logout) logout();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark"); // Tailwind dark mode
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                DriveRent
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </Link>

            <Link
              href="/cars"
              className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              Cars
            </Link>

            <Link
              href="/locations"
              className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              Locations
            </Link>

            <Link
              href="/about"
              className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin Links */}
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                  >
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User Links */}
                {user.role === "user" && (
                  <>
                    <Link
                      href="/bookings"
                      className="flex items-center space-x-1 text-secondary-600 hover:text-primary-600 transition-colors font-medium"
                    >
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      href="/payments"
                      className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
                    >
                      Payments
                    </Link>
                  </>
                )}

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-secondary-600">
                    <User size={18} />
                    <span className="font-medium">{user.name}</span>

                    {/* Role Badge */}
                    <span
                      className={`px-2 py-1 text-xs rounded-full 
                      ${
                        user.role === "admin"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-primary-50 text-primary-700"
                      }
                    `}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-secondary-600 hover:text-accent-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/users/login"
                  className="text-secondary-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/users/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-300 font-medium"
                >
                  Sign Up
                </Link>

                {/* Sign Up with Light/Dark toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="px-4 py-2 rounded-lg hover:bg-primary-700 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2"
                >
                  {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-600 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>

              <Link
                href="/cars"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                Cars
              </Link>

              <Link
                href="/locations"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                Locations
              </Link>

              <Link
                href="/about"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                Contact
              </Link>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  {user.role === "user" && (
                    <>
                      <Link
                        href="/bookings"
                        className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/payments"
                        className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                      >
                        Payments
                      </Link>
                    </>
                  )}

                  {/* Profile Section */}
                  <div className="px-3 py-2 text-secondary-600 border-t mt-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>{user.name}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-primary-50 text-primary-700"
                        }
                      `}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-secondary-600 hover:text-accent-600 hover:bg-gray-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/users/login"
                    className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/users/register"
                    className="block px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                  >
                    Sign Up
                  </Link>

                  <button
                    onClick={toggleDarkMode}
                    className="p-1 text-secondary-600 hover:text-primary-600"
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
