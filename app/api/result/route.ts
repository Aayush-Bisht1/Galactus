import { connectDB } from "@/lib/db";
import { Result } from "@/models/Result";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    await connectDB();
    
    try {
        const { userId, data } = await req.json();
        
        if (!userId || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }
        
        // Preserve the complete nested structure from the form processing
        const normalizedData = data.map((train: any) => {
            // Handle reasons - can be string or array
            const reasons: string[] = Array.isArray(train.reasons)
                ? train.reasons
                : typeof train.reasons === "string"
                    ? train.reasons.split(" | ").map((s: string) => s.trim()).filter(Boolean)
                    : [];

            // Handle recommendations - can be string or array  
            const recommendations: string[] = Array.isArray(train.recommendations)
                ? train.recommendations
                : typeof train.recommendations === "string"
                    ? train.recommendations.split(" | ").map((s: string) => s.trim()).filter(Boolean)
                    : [];

            return {
                train_id: train.train_id || '',
                priority_score: Number(train.priority_score || 0),
                eligible: Boolean(train.eligible),
                status: train.status || "Standby", // Ensure status is preserved
                fitness_days_left: typeof train.fitness_days_left === "number" ? train.fitness_days_left : 0,
                reasons,
                recommendations,
                // Preserve complete cleaning object structure
                cleaning: {
                    last_clean_end: train.cleaning?.last_clean_end || null,
                    clean_age_hours: typeof train.cleaning?.clean_age_hours === "number" ? train.cleaning.clean_age_hours : 0,
                    today_clean_load: typeof train.cleaning?.today_clean_load === "number" ? train.cleaning.today_clean_load : 0,
                },
                // Preserve complete maintenance object structure
                maintenance: {
                    open_work_orders: typeof train.maintenance?.open_work_orders === "number" ? train.maintenance.open_work_orders : 0,
                    open_work_order_hours: typeof train.maintenance?.open_work_order_hours === "number" ? train.maintenance.open_work_order_hours : 0,
                }
            };
        });

        console.log('Saving normalized data:', JSON.stringify(normalizedData.slice(0, 1), null, 2)); // Log first item for debugging
        
        const newResult = await Result.create({ userId, data: normalizedData });
        
        return NextResponse.json({ 
            result: newResult,
            message: "Data saved successfully",
            totalTrains: normalizedData.length
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error saving result:", error);
        return NextResponse.json({ 
            error: "Failed to save optimization results",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
        }
        
        const payload = jwt.decode(token) as { id?: string } | null;
        const uid = payload?.id;

        if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Get the latest result for the user
        const latest = await Result.findOne({ userId: uid })
            .sort({ createdAt: -1 })
            .lean() as { data: any[]; createdAt: Date } | null;
        
        if (!latest || !latest.data) {
            return NextResponse.json({ 
                data: [], 
                createdAt: null,
                message: "No train data found"
            }, { status: 200 });
        }

        // Return data with complete structure preserved
        const processedData = latest.data.map((train: any) => {
            // Handle reasons - ensure array format for frontend
            const reasons: string[] = Array.isArray(train.reasons)
                ? train.reasons
                : typeof train.reasons === "string"
                    ? train.reasons.split(" | ").map((s: string) => s.trim()).filter(Boolean)
                    : [];

            // Handle recommendations - ensure array format for frontend
            const recommendations: string[] = Array.isArray(train.recommendations)
                ? train.recommendations
                : typeof train.recommendations === "string"
                    ? train.recommendations.split(" | ").map((s: string) => s.trim()).filter(Boolean)
                    : [];

            return {
                train_id: train.train_id || '',
                priority_score: typeof train.priority_score === "number" ? train.priority_score : 0,
                eligible: Boolean(train.eligible),
                status: train.status || "Standby", // Ensure status is returned
                fitness_days_left: typeof train.fitness_days_left === "number" ? train.fitness_days_left : 0,
                reasons,
                recommendations,
                // Return complete cleaning object
                cleaning: {
                    last_clean_end: train.cleaning?.last_clean_end || null,
                    clean_age_hours: typeof train.cleaning?.clean_age_hours === "number" ? train.cleaning.clean_age_hours : 0,
                    today_clean_load: typeof train.cleaning?.today_clean_load === "number" ? train.cleaning.today_clean_load : 0,
                },
                // Return complete maintenance object
                maintenance: {
                    open_work_orders: typeof train.maintenance?.open_work_orders === "number" ? train.maintenance.open_work_orders : 0,
                    open_work_order_hours: typeof train.maintenance?.open_work_order_hours === "number" ? train.maintenance.open_work_order_hours : 0,
                }
            };
        });

        console.log('Returning processed data sample:', JSON.stringify(processedData.slice(0, 1), null, 2)); // Debug log

        return NextResponse.json({ 
            data: processedData, 
            createdAt: latest.createdAt,
            totalTrains: processedData.length,
            message: "Train data loaded successfully"
        }, { status: 200 });
        
    } catch (err) {
        console.error("Error loading results:", err);
        return NextResponse.json({ 
            error: "Failed to load train results",
            details: err instanceof Error ? err.message : "Unknown error"
        }, { status: 500 });
    }
}