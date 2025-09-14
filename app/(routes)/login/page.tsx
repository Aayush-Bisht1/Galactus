"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

function LogIn() {
    const router = useRouter();
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let formData = new FormData();
            formData.append('email', data.email)
            formData.append('password', data.password)

            const res = await axios.post('/api/auth/login', formData);

            if (res.status === 201) {
                toast.success("Login successful!");
                router.push('/dashboard');
            }
        } catch (err: any) {
            const message = err.response?.data?.error || "Login failed!";
            toast.error(message);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
                    KMRL – Login
                </h1>

                <Input
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="mb-4"
                />
                <Input
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="mb-6"
                />

                <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSubmit}>
                    Login
                </Button>
                <p className='pt-4 text-red-500 flex items-center justify-center gap-3'>Not Registered yet ! <Link href={'/signup'}><Button className='bg-blue-500 hover:bg-blue-600'>SignUp</Button></Link></p>
            </div>
        </div>
    );
}

export default LogIn