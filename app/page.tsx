import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto px-8 py-12">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-10 text-white">

          <h1 className="text-5xl font-bold">
            Invoice Management System
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Upload invoices, extract invoice information automatically,
            store them in PostgreSQL and manage everything from one dashboard.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">

          {/* Upload Card */}

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

            <div className="text-6xl mb-5">
              📤
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Upload Invoice
            </h2>

            <p className="mt-3 text-gray-600">
              Upload a PDF invoice and automatically extract invoice number,
              vendor, total amount and invoice date.
            </p>

            <Link href="/upload">

              <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                Upload PDF
              </button>

            </Link>

          </div>

          {/* View Card */}

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

            <div className="text-6xl mb-5">
              📄
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              View Invoices
            </h2>

            <p className="mt-3 text-gray-600">
              Browse uploaded invoices, search by vendor or invoice number
              and open complete invoice details.
            </p>

            <Link href="/invoices">

              <button className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                Open Dashboard
              </button>

            </Link>

          </div>

        </div>

        <div className="mt-14 bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg text-gray-800">
                📄 PDF Upload
              </h3>

              <p className="text-gray-600 mt-2">
                Upload invoice PDFs directly from the browser.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg text-gray-800">
                🤖 Automatic Extraction
              </h3>

              <p className="text-gray-600 mt-2">
                Extract invoice details using a Python FastAPI backend.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg text-gray-800">
                🗄 PostgreSQL Storage
              </h3>

              <p className="text-gray-600 mt-2">
                Save invoice data securely using Prisma ORM.
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="font-semibold text-lg text-gray-800">
                🔍 Search & View
              </h3>

              <p className="text-gray-600 mt-2">
                Search invoices and view complete invoice information.
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}