import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // -----------------------------
    // GET FILE FROM FRONTEND
    // -----------------------------
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // -----------------------------
    // SEND TO FASTAPI (RENDER BACKEND)
    // -----------------------------
    const pythonForm = new FormData();
    pythonForm.append("file", file);

    const backendUrl = process.env.PYTHON_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const pythonResponse = await fetch(
      `${backendUrl}/extract-pdf/`,
      {
        method: "POST",
        body: pythonForm,
      }
    );

    const pythonData = await pythonResponse.json();

    if (!pythonResponse.ok || !pythonData.success) {
      return NextResponse.json(
        { success: false, error: "Python backend failed" },
        { status: 500 }
      );
    }

    const f = pythonData.fields;

    // -----------------------------
    // SAVE TO DATABASE (PRISMA + NEON)
    // -----------------------------
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: f.invoiceNumber || null,
        vendorName: f.vendorName || null,
        gstNumber: null,
        invoiceDate: f.invoiceDate ? new Date(f.invoiceDate) : null,
        totalAmount: f.totalAmount ? parseFloat(f.totalAmount) : null,
        fileUrl: file.name,
        rawText: pythonData.text || null,
        status: "COMPLETED",
        userId: "592cdaad-b055-4708-967b-ad7dc549b29c",
      },
    });

    // -----------------------------
    // RESPONSE TO FRONTEND
    // -----------------------------
    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}