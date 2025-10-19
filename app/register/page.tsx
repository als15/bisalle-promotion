"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [contactValue, setContactValue] = useState("");
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
          email: contactType === "email" ? contactValue : undefined,
          phone: contactType === "phone" ? contactValue : undefined,
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          הרשמה למתנה
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          מלא את הפרטים כדי לקבל את קוד המתנה שלך
        </p>

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
              איך ליצור קשר
            </label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={contactType === "email"}
                  onChange={() => setContactType("email")}
                  className="ml-2"
                />
                אימייל
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="phone"
                  checked={contactType === "phone"}
                  onChange={() => setContactType("phone")}
                  className="ml-2"
                />
                טלפון
              </label>
            </div>
            <input
              type={contactType === "email" ? "email" : "tel"}
              required
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3018b4] focus:border-transparent"
              placeholder={
                contactType === "email"
                  ? "example@email.com"
                  : "050-1234567"
              }
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
            {loading ? "שולח..." : "קבל קוד מתנה"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          המידע שלך ישמש רק למבצע זה. מתנה אחת לאדם.
        </p>
      </div>
    </div>
  );
}
