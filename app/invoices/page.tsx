"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/invoices`)
      .then((res) => res.json())
      .then((data) => {
        setInvoices(Array.isArray(data?.invoices) ? data.invoices : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const keyword = search.toLowerCase();

    return (
      invoice.invoiceNumber?.toLowerCase().includes(keyword) ||
      invoice.vendorName?.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Invoice Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              View and manage uploaded invoices.
            </p>
          </div>

          <Link href="/upload">
            <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow">
              + Upload Invoice
            </button>
          </Link>

        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <input
            type="text"
            placeholder="Search by Invoice Number or Vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No invoices found.
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="text-left px-6 py-4">Invoice No</th>
                  <th className="text-left px-6 py-4">Vendor</th>
                  <th className="text-left px-6 py-4">Amount</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-center px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {invoice.invoiceNumber || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {invoice.vendorName || "-"}
                    </td>

                    <td className="px-6 py-4 text-green-600 font-semibold">
                      ${invoice.totalAmount || "0.00"}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {invoice.invoiceDate
                        ? formatDate(invoice.invoiceDate)
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link href={`/invoices/${invoice.id}`}>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                          View
                        </button>
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>
    </main>
  );
}