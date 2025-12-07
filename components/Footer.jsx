// components/Footer.jsx
import Link from 'next/link'
import { Car, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary-600 text-primary-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="text-primary-500" size={32} />
              <span className="text-2xl font-bold">DriveRent</span>
            </div>

            <p className="text-primary-200 mb-4 max-w-md">
              Your trusted partner for premium car rentals.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-primary-200">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-200">
                <Mail size={16} />
                <span>info@driverent.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-50">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-primary-200 hover:text-primary-50">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-primary-200 hover:text-primary-50">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-primary-200 hover:text-primary-50">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-50">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-primary-200 hover:text-primary-50">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-200 hover:text-primary-50">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-500 mt-8 pt-8 text-center text-primary-200">
          <p>© 2024 DriveRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
