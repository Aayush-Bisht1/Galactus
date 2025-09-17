import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth"; // adjust path
import { Result } from "@/models/Result";

export async function GET(req: Request) {
    try {
        const user = await getUserFromCookie();
        const userId =
            user && typeof user === "object" && "id" in user ? (user as { id: string }).id : null;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allocation = await Result.findOne({ userId }).sort({ createdAt: -1 }).lean();
        if (!allocation) {
            return NextResponse.json({ error: "No allocation data found" }, { status: 404 });
        }

        // Ensure allocation has a 'data' property, or handle accordingly
        const data = (allocation as any).data || [];
        const statusSummary = data.reduce(
            (acc: Record<string, number>, train: any) => {
                acc[train.status] = (acc[train.status] || 0) + 1;
                return acc;
            },
            { Ready: 0, Standby: 0, Maintenance: 0 } // ensures keys always exist
        );

        return NextResponse.json({
            ...allocation,
            statusSummary,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
