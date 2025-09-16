import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'

export default async function middleware(req: NextRequest) {
    const BearerToken = req.headers.get('Authorization') as string;
    if (!BearerToken) {
        return NextResponse.json({ error: 'Bearer token is not defined' }, { status: 400 })
    }

    const token = BearerToken.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Token is not defined' }, { status: 400 })
    }

    const signature = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
        await jose.jwtVerify(token, signature)
        return NextResponse.next()
        
    } catch (error) {
        return NextResponse.json({error: 'User is not authorized'},{status:500})
    }
}

export const config = {
    matcher: ['/api/dashboard']
}