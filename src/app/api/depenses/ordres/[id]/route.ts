import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Ordre } from "@/lib/models/index";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const item = await Ordre.findById(params.id).populate("ligne");
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const item = await Ordre.findByIdAndUpdate(params.id, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const item = await Ordre.findByIdAndDelete(params.id);
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Supprimé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
