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
        const item = new Ordre(body);
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Ordre créé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
