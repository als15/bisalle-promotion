"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChocolatePromotion() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push(`/gift/${data.code}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3018b4] to-[#44cdaa] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block bg-[#44cdaa]/20 rounded-full p-4 mb-4">
            <svg
              className="w-12 h-12 text-[#3018b4]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            מבצע שוקולד ביסַלֶה
          </h1>
          <p className="text-gray-600">
            הירשם כדי לקבל שוקולד במתנה!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם מלא
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3018b4] focus:border-transparent"
              placeholder="ישראל ישראלי"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מספר טלפון
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3018b4] focus:border-transparent"
              placeholder="050-1234567"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3018b4] hover:bg-[#3018b4]/90 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "שולח..." : "קבל שוקולד במתנה"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          מתנה אחת לאדם. בכפוף למלאי.
        </p>
      </div>
    </div>
  );
}
