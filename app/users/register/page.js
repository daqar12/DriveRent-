// app/users/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/utils/validators";
import {
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ REAL BACKEND REGISTER
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      );

      // 👉 kadib register → u dir login
      router.push("/users/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Registration failed"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-4"></div>

        <h2 className="text-center text-4xl font-bold text-gray-900">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join DriveRent today! Rent premium cars with ease and confidence.
        </p>
      </div>

      <div className="mt-8  sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
        
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"} // hidden by default
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* EyeOff when password is hidden, Eye when shown */}
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} // hidden by default
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-700"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/users/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
