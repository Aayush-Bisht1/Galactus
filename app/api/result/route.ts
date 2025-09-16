import { connectDB } from "@/lib/db";
import { Result } from "@/models/Result";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    const { userId, data } = await req.json();
    const newResult = await Result.create({ userId, data });
    return NextResponse.json({ result: newResult }, { status: 201 });
}