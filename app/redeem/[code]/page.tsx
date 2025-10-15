"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RedeemPage() {
  const params = useParams();
  const code = params.code as string;
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/api/participant/${code}`);
        if (!response.ok) {
          throw new Error("Invalid code");
        }
        const data = await response.json();
        setParticipant(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [code]);

  const handleRedeem = async () => {
    setRedeeming(true);
    setError("");

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Redemption failed");
      }

      setSuccess(true);
      setParticipant(data.participant);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Gift Redeemed!
          </h1>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">{participant.fullName}</span> has
            successfully received their gift.
          </p>
          <p className="text-sm text-gray-500">
            Redeemed on {new Date(participant.redeemedAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  if (participant?.redeemed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Already Redeemed
          </h1>
          <p className="text-gray-600 mb-2">
            This gift was already claimed by{" "}
            <span className="font-semibold">{participant.fullName}</span>.
          </p>
          <p className="text-sm text-gray-500">
            Redeemed on {new Date(participant.redeemedAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Redeem Gift
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-1">
            Participant:
          </p>
          <p className="text-lg font-bold text-blue-800">
            {participant.fullName}
          </p>
          {participant.email && (
            <p className="text-sm text-blue-700 mt-1">{participant.email}</p>
          )}
          {participant.phone && (
            <p className="text-sm text-blue-700 mt-1">{participant.phone}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleRedeem}
          disabled={redeeming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition duration-200 text-lg"
        >
          {redeeming ? "Processing..." : "Confirm & Give Gift"}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Click the button above to mark this gift as redeemed
        </p>
      </div>
    </div>
  );
}
