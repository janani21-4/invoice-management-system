"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF invoice.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/extract-pdf/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Upload Invoice
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Select a PDF invoice to extract invoice information automatically.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && (
          <p className="mt-4 text-blue-600">
            Selected: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Upload Invoice"}
        </button>

        {result?.success && (
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <h2 className="text-green-700 font-bold">
              Upload Successful
            </h2>

            <p>Invoice: {result.invoice.invoiceNumber}</p>
            <p>Vendor: {result.invoice.vendorName}</p>
            <p>Amount: {result.invoice.totalAmount}</p>
          </div>
        )}

      </div>
    </main>
  );
}