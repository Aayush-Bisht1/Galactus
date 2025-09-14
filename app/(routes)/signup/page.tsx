"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'

function SignUp() {
    const [data, setData] = useState({
        email: "",
        password: "",
        role: "",
        username: ""
    });
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
            formData.append('role', data.role)
            formData.append('username', data.username)

            const res = await axios.post('/api/auth/signup', formData);

            if (res.status === 201) {
                toast.success("Signup successful!");
            }
        } catch (err: any) {
            const message = err.response?.data?.error || "Signup failed!";
            toast.error(message);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
                    KMRL - Create Account
                </h1>

                <Input
                    name="username"
                    value={data.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="mb-4"
                />
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
                    className="mb-4"
                />
                <Select
                    onValueChange={(val) => setData((prev) => ({ ...prev, role: val }))}
                >
                    <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="engineer">Maintenance Engineer</SelectItem>
                    </SelectContent>
                </Select>

                <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSubmit}>
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default SignUp;