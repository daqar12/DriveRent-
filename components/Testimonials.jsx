"use client";

import { Star, ChevronRight, User } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment:
      "Amazing service! The team was so helpful and made everything super easy.",
    date: "Dec 10, 2025",
  },
  {
    id: 2,
    name: "Michael Smith",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    comment:
      "Great experience overall, but there was a slight delay in delivery.",
    date: "Dec 8, 2025",
  },
  {
    id: 3,
    name: "Emily Davis",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    comment: "Highly recommend! Professional and reliable service every time.",
    date: "Dec 5, 2025",
  },
  {
    id: 4,
    name: "James Wilson",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    comment: "Good quality and easy to use. Will use again!",
    date: "Dec 2, 2025",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h2>
          <p className="text-gray-600">What our customers say about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {review.name}
                  </span>
                  <div className="text-gray-500 text-sm">{review.date}</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/reviews"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Read more reviews
            <ChevronRight size={18} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
