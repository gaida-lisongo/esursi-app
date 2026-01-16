import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Ligne } from "@/lib/models/index";

export async function GET() {
    try {
        await dbConnect();
        const items = await Ligne.find({});
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const item = new Ligne(body);
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Ligne budgétaire créée" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const searchParams = new URL(req.url).searchParams;
        const ligneId = searchParams.get("ligneId");
        const body = await req.json();
        const item = await Ligne.findByIdAndUpdate(ligneId, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Ligne non trouvée" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Ligne mise à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const searchParams = new URL(req.url).searchParams;
        const ligneId = searchParams.get("ligneId");
        const item = await Ligne.findByIdAndDelete(ligneId);
        if (!item) return NextResponse.json({ success: false, message: "Ligne non trouvée" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Ligne supprimée" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
