import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Tranche } from "@/lib/models/index";

export async function GET() {
    try {
        await dbConnect();
        const items = await Tranche.find({}).populate("frais");
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const item = new Tranche(body);
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Tranche créée" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
