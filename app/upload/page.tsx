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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">

          <div className="text-center">

            <div className="text-6xl mb-4">
              📄
            </div>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700
              file:mr-4 file:rounded-lg file:border-0
              file:bg-blue-600 file:px-4 file:py-2
              file:text-white hover:file:bg-blue-700"
            />

            {file && (
              <div className="mt-5 bg-blue-50 rounded-lg p-4">

                <p className="font-semibold text-blue-700">
                  Selected File
                </p>

                <p className="text-gray-700 mt-1">
                  {file.name}
                </p>

              </div>
            )}

          </div>

        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "Processing Invoice..." : "Upload Invoice"}
        </button>

        {result?.success && (

          <div className="mt-8 bg-green-50 border border-green-300 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-green-700">
              ✅ Invoice Uploaded Successfully
            </h2>

            <div className="mt-5 space-y-2 text-gray-700">

              <p>
                <b>Invoice Number:</b>{" "}
                {result.invoice.invoiceNumber || "-"}
              </p>

              <p>
                <b>Vendor:</b>{" "}
                {result.invoice.vendorName || "-"}
              </p>

              <p>
                <b>Amount:</b> $
                {result.invoice.totalAmount || "0.00"}
              </p>

              <p>
                <b>Status:</b>{" "}
                {result.invoice.status}
              </p>

            </div>

            <div className="flex gap-4 mt-8">

              <Link href="/invoices">

                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                  View Invoices
                </button>

              </Link>

              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Upload Another
              </button>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}