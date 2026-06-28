import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
    const user = await prisma.user.create({
        data: {
            name: "Janani",
            email: "janani@gmail.com",
            password: "test123",
        },
    });

    return NextResponse.json(user);
}