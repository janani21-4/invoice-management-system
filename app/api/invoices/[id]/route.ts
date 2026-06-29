import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// ---------------- GET SINGLE INVOICE ----------------
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invoice not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            invoice,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}