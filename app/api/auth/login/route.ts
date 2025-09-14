import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import * as jose from 'jose';
import { TextEncoder } from "util";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        }

        if (!data.email || !data.password) {
            return NextResponse.json({ error: "Some fields are missing" }, { status: 400 });
        }

        const user = await User.findOne({ email: data.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
        
        const result = await bcrypt.compare(data.password,user.password);
        
        if (!result) {
            return NextResponse.json({ error: "Password is incorrect" }, { status: 400 });
        }

        const alg = "HS256"
        const signature = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new jose.SignJWT({ email: user.email })
        .setProtectedHeader({ alg })
        .setExpirationTime("7d")
        .sign(signature)

        if(!token){
            return NextResponse.json({error: 'Token is not created'},{status:400})
        }

        return NextResponse.json({token},{status:201});
    } catch (error) {
        return NextResponse.json(error,{status:500})
    }
}