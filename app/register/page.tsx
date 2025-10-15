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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Register for Your Gift
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Fill in your details to receive your gift code
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Method
            </label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={contactType === "email"}
                  onChange={() => setContactType("email")}
                  className="mr-2"
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="phone"
                  checked={contactType === "phone"}
                  onChange={() => setContactType("phone")}
                  className="mr-2"
                />
                Phone
              </label>
            </div>
            <input
              type={contactType === "email" ? "email" : "tel"}
              required
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={
                contactType === "email"
                  ? "john@example.com"
                  : "+1234567890"
              }
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Registering..." : "Get My Gift Code"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your information will only be used for this promotion. One gift per person.
        </p>
      </div>
    </div>
  );
}
