// components/Header.jsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GD</span>
            </div>
            <span className="text-2xl font-bold text-secondary-600">GoDrive</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-secondary-600 hover:text-primary-600 transition-colors">
              My Bookings
            </Link>
            <Link href="/about" className="text-secondary-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors">
              Contact
            </Link>

          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-secondary-600 hover:text-primary-600 transition-colors">
              Login
            </button>

            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
