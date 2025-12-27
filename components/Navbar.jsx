"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) logout();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Image Logo */}
              <Image
                src="/Driverent.png" // place your logo in the public folder
                alt="DriveRent Logo"
                width={40} // adjust size as needed
                height={40}
                className="mr-2 object-contain"
              />
              {/* Optional Text next to the logo */}
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                DriveRent
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-secondary-600 hover:text-primary-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="text-secondary-600 hover:text-primary-600 font-medium"
            >
              Cars
            </Link>
            <Link
              href="/locations"
              className="text-secondary-600 hover:text-primary-600 font-medium"
            >
              Locations
            </Link>
            <Link
              href="/about"
              className="text-secondary-600 hover:text-primary-600 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-secondary-600 hover:text-primary-600 font-medium"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Role based links */}
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "user" && (
                  <>
                    <Link
                      href="/bookings/user"
                      className="text-primary-600 hover:text-secondary-600 font-medium"
                    >
                      My Bookings
                    </Link>
                    {/* Optional payments link */}
                    {/* <Link href="/payments" className="text-primary-600 hover:text-secondary-600 font-medium">Payments</Link> */}
                  </>
                )}

                {/* Profile & Logout */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-secondary-600 hover:text-accent-600"
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
                  className="text-secondary-600 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/users/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
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
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/cars"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
              >
                Cars
              </Link>
              <Link
                href="/locations"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
              >
                Locations
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
              >
                Contact
              </Link>

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-primary-600 font-medium rounded-lg"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "user" && (
                    <>
                      <Link
                        href="/bookings/my"
                        className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/payments"
                        className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
                      >
                        Payments
                      </Link>
                    </>
                  )}
                  {/* Profile & Logout */}
                  <div className="px-3 py-2 border-t mt-2 flex items-center justify-between">
                    {/* <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>{user.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-primary-100 text-primary-700" : "bg-primary-50 text-primary-700"}`}>
                        {user.role}
                      </span>
                    </div> */}
                    <button
                      onClick={handleLogout}
                      className="text-secondary-600 hover:text-accent-600"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/users/login"
                    className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/users/register"
                    className="block px-3 py-2 text-secondary-600 hover:text-primary-600 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
