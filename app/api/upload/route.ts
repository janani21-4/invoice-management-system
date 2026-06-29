import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    }

    const pythonForm = new FormData();
    pythonForm.append("file", file);

    const backendUrl = process.env.PYTHON_BACKEND_URL;

    const pythonResponse = await fetch(`${backendUrl}/extract-pdf/`, {
      method: "POST",
      body: pythonForm,
    });

    const pythonData = await pythonResponse.json();

    if (!pythonData.success) {
      return NextResponse.json({ success: false, error: "PDF failed" }, { status: 500 });
    }

    const f = pythonData.fields;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: f.invoiceNumber || null,
        vendorName: f.vendorName || null,
        invoiceDate: f.invoiceDate ? new Date(f.invoiceDate) : null,
        totalAmount: f.totalAmount ? parseFloat(f.totalAmount) : null,
        fileUrl: file.name,
        rawText: pythonData.text || null,
        status: "COMPLETED",
        userId: "demo-user",
      },
    });

    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}