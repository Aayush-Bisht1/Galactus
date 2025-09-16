import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
    }

    const signature = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
        await jose.jwtVerify(token, signature)
        return NextResponse.next()

    } catch (error) {
        return NextResponse.json({ error: 'User is not authorized' }, { status: 500 })
    }
}

export const config = {
    matcher: ['/api/dashboard']
}