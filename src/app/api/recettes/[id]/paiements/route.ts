import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Paiement } from "@/lib/models/index";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const items = await Paiement.find({ tranche: params.id as any }).populate("etudiant");
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const item = new Paiement({ ...body, tranche: params.id as any });
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Paiement enregistré" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
