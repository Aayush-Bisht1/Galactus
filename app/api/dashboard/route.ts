import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { User } from "@/models/User";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
    await connectDB();
    
    const headerInstance = headers();

    const BearerToken = (await headerInstance).get('Authorization') as string;
    const token = BearerToken.split(' ')[1];

    const payload = jwt.decode(token) as {email: string};    

    const user = await User.findOne({email: payload.email})

    return NextResponse.json(user, {status: 201})
}