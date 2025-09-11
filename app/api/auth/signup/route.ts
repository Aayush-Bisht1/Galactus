import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            role: formData.get('role') as string,
            username: formData.get('username') as string
        }

        if (!data.email || !data.password || !data.role || !data.username) {
            return NextResponse.json({ error: 'Some fields are empty' }, { status: 400 })
        }

        const user = await User.findOne({ email: data.email });
        
        if(user){
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        if(data.password.length < 7){
            return NextResponse.json({error: 'Password length should be atleast 7'},{status: 400});
        }

        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);

        const newuser = new User(data);
        await newuser.save();

        return NextResponse.json(newuser, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'signup failed' }, { status: 500 })
    }
}