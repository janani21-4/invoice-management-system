"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function InvoiceDetail() {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : null;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data.invoice);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Invalid Invoice ID
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Invoice not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Invoice Details
            </h1>

            <p className="text-gray-500 mt-2">
              Complete invoice information
            </p>
          </div>

          <Link href="/invoices">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow">
              ← Back
            </button>
          </Link>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Invoice Information
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Invoice Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.invoiceNumber || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Vendor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.vendorName || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">GST Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.gstNumber || "-"}
                </p>
              </div>

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Payment Information
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${invoice.totalAmount || "0.00"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Invoice Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.invoiceDate
                    ? new Date(invoice.invoiceDate)
                      .toISOString()
                      .split("T")[0]
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  {invoice.status}
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Extracted Raw Text
          </h2>

          <pre className="bg-gray-100 text-black rounded-lg p-5 overflow-auto whitespace-pre-wrap border">
            {invoice.rawText || "No extracted text available."}
          </pre>

        </div>

      </div>

    </main>
  );
}