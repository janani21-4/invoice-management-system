import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // -----------------------------
    // SEND TO PYTHON BACKEND
    // -----------------------------
    const pythonForm = new FormData();
    pythonForm.append("file", file);

    const pythonResponse = await fetch(
      "http://127.0.0.1:8000/extract-pdf/",
      {
        method: "POST",
        body: pythonForm,
      }
    );

    const pythonData = await pythonResponse.json();

    if (!pythonData.success) {
      return NextResponse.json(
        { success: false, error: "Python processing failed" },
        { status: 500 }
      );
    }

    const f = pythonData.fields;

    // -----------------------------
    // SAVE TO PRISMA (YOUR SCHEMA)
    // -----------------------------
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: f.invoiceNumber || null,
        vendorName: f.vendorName || null,
        gstNumber: null,
        invoiceDate: f.invoiceDate ? new Date(f.invoiceDate) : null,
        totalAmount: f.totalAmount
          ? parseFloat(f.totalAmount)
          : null,
        fileUrl: file.name,
        rawText: pythonData.text || null,
        status: "COMPLETED",
        userId: "592cdaad-b055-4708-967b-ad7dc549b29c", // replace with real auth later
      },
    });

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}