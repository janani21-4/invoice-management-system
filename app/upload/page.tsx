"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF invoice.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

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

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Upload failed");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
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
          Upload PDF to extract invoice details automatically
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

        {/* ERROR BOX */}
        {error && (
          <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* SUCCESS BOX */}
        {result?.success && result?.invoice && (
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <h2 className="text-green-700 font-bold text-lg">
              Upload Successful
            </h2>

            <p>Invoice: {result.invoice.invoiceNumber || "-"}</p>
            <p>Vendor: {result.invoice.vendorName || "-"}</p>
            <p>Amount: {result.invoice.totalAmount || "0.00"}</p>
            <p>Status: {result.invoice.status}</p>

            <div className="flex gap-4 mt-6">

              <Link href="/invoices">
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  View Invoices
                </button>
              </Link>

              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError(null);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded"
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