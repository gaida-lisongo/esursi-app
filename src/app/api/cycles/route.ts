import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Cycle, Programme } from "@/lib/models";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const searchParams = new URL(request.url).searchParams;
        const id = searchParams.get("id") || "";

        if (id) {
            const cycleId = new mongoose.Types.ObjectId(id);
            const programmes = await Programme.find({ cycle: cycleId }).populate("cycle").where("actif").equals(true);
            return NextResponse.json({ success: true, programmes });
        } else {
            const cycles = await Cycle.find().populate("programmes").where("actif").equals(true);
            return NextResponse.json({ success: true, cycles });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
} 