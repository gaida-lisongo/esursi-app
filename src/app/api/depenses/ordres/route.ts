import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Ordre } from "@/lib/models/index";

export async function GET() {
    try {
        await dbConnect();
        const items = await Ordre.find({}).populate("ligne");
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { planId, ...ordreData } = body;

        const item = new Ordre(ordreData);
        await item.save();

        if (planId) {
            const { PlanHebdo } = await import("@/lib/models/index");
            await PlanHebdo.findByIdAndUpdate(planId, {
                $push: { ordres: item._id }
            });
        }

        return NextResponse.json({ success: true, data: item, message: "Ordre créé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
