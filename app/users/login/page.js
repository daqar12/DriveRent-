"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/utils/validators";
import { Mail, Lock, AlertCircle, User, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Call login from context (should return JWT and user info)
      await login(formData.email, formData.password);

      // Redirect to home page after successful login
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="flex justify-center mb-4">
              <div className=" w-24 h-12">
                <Image
                  src="/Driverent.png" 
                  alt="DriveRent Logo"
                  width={50} 
                  height={50}
                  className="object-contain"
                />
              </div>
            </div>

            <h2 className="text-center text-4xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-8 text-center text-sm text-gray-600">
              Sign in to your DriveRent account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                {/* Input field */}
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />

                {/* Eye toggle button on the right */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-primary-500 to-primary-700 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/users/register"
                className="text-blue-600 font-medium hover:text-blue-500"
              >
                Register here
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <Link
                href="/"
                className="text-blue-600 font-medium hover:text-blue-500"
              >
                Website Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
