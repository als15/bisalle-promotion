"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function GiftPage() {
  const params = useParams();
  const code = params.code as string;
  const [qrCode, setQrCode] = useState<string>("");
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/api/participant/${code}`);
        if (!response.ok) {
          throw new Error("Invalid code");
        }
        const data = await response.json();
        setParticipant(data);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const qrResponse = await fetch(
          "/api/qr?url=" + encodeURIComponent(`${baseUrl}/redeem/${code}`)
        );
        const qrData = await qrResponse.json();
        setQrCode(qrData.qrCode);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || "Invalid code"}</p>
        </div>
      </div>
    );
  }

  if (participant.fulfilled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Already Fulfilled
          </h1>
          <p className="text-gray-600">
            This gift has already been claimed on{" "}
            {new Date(participant.fulfilledAt).toLocaleDateString()}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-block bg-green-100 rounded-full p-3 mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations, {participant.fullName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Show this QR code at our shop to receive your gift
          </p>
        </div>

        {qrCode && (
          <div className="bg-white p-6 rounded-xl shadow-inner border-4 border-purple-200 inline-block mb-6">
            <Image
              src={qrCode}
              alt="Gift Redemption QR Code"
              width={256}
              height={256}
            />
          </div>
        )}

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
          <p className="text-sm font-semibold text-purple-900 mb-2">
            Important:
          </p>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Screenshot this QR code for easy access</li>
            <li>• Present it at our shop to claim your gift</li>
            <li>• Valid for one-time use only</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Code: {code}
        </p>
      </div>
    </div>
  );
}
