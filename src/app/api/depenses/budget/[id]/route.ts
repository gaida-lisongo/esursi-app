import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Budget } from "@/lib/models/index";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await Budget.findById(params.id)
            .populate("etablissement")
            .populate("annee")
            .populate("details")
            .populate("details.ligne");
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        const item = await Budget.findByIdAndUpdate(params.id, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await Budget.findByIdAndDelete(params.id);
        if (!item) return NextResponse.json({ success: false, message: "Non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Supprimé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
