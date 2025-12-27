"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* ===== READ USER FROM SESSION STORAGE ===== */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ===== FETCH ONLY USER BOOKINGS ===== */
  useEffect(() => {
    if (!user) return;

    const fetchMyBookings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:4000/api/booking", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await res.json();

        // ✅ Kaliya bookings-ka user-kan
        const userBookings = Array.isArray(json.data)
          ? json.data.filter(
              (b) =>
                b.userId === user.id || b.userId === user._id
            )
          : [];

        setBookings(userBookings);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user]);

  if (!user) {
    return <div className="p-10 text-center">Please login</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <p className="font-semibold">{booking.carName}</p>
                <p className="text-gray-500">
                  Booking ID: {booking.bookingId}
                </p>
                <p>Status: {booking.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
