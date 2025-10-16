"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ChocolatePromotion() {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    fetch("/api/qr?url=" + encodeURIComponent(`${baseUrl}/register`))
      .then((res) => res.json())
      .then((data) => setQrCode(data.qrCode));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bisalle Chocolate Promotion
        </h1>
        <p className="text-gray-600 mb-6">
          Scan this QR code to register and receive your gift!
        </p>
        {qrCode ? (
          <div className="bg-white p-4 rounded-lg inline-block shadow-inner">
            <Image
              src={qrCode}
              alt="Registration QR Code"
              width={256}
              height={256}
            />
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg mx-auto"></div>
        )}
        <p className="text-sm text-gray-500 mt-6">
          One gift per person. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
