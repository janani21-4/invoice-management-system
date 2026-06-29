import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
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