"use client";

import { useState } from "react";

export default function ShopScan() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // First, get participant info
      const participantRes = await fetch(`/api/participant/${code}`);
      if (!participantRes.ok) {
        throw new Error("Invalid code");
      }
      const participant = await participantRes.json();

      // Check if already fulfilled
      if (participant.fulfilled) {
        setError(
          `Already fulfilled on ${new Date(
            participant.fulfilledAt
          ).toLocaleDateString()}`
        );
        setLoading(false);
        return;
      }

      // Mark as fulfilled
      const redeemRes = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const redeemData = await redeemRes.json();

      if (!redeemRes.ok) {
        throw new Error(redeemData.error || "Failed to fulfill");
      }

      setResult(redeemData.participant);
      setCode("");
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
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            סורק חנות
          </h1>
          <p className="text-gray-600">סרוק קודי QR של לקוחות למימוש מתנות</p>
        </div>

        <form onSubmit={handleScan} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הכנס קוד או סרוק QR
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3018b4] focus:border-transparent font-mono text-lg"
              placeholder="הכנס קוד מימוש"
              autoFocus
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3018b4] hover:bg-[#3018b4]/90 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "מעבד..." : "מימוש מתנה"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="mr-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border-r-4 border-green-500 p-4">
            <div className="flex items-start">
              <div className="mr-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">
                  המתנה מומשה בהצלחה!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p className="font-semibold">{result.fullName}</p>
                  <p className="text-xs text-green-600 mt-1" dir="ltr">
                    {result.phone || result.email}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            לשימוש צוות החנות בלבד
          </p>
        </div>
      </div>
    </div>
  );
}
