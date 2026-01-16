import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Parcours } from "@/lib/models/index";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const items = await Parcours.find({ etudiant: params.id as any })
            .populate("programme")
            .populate("annee")
            .populate("etablissement");
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const item = new Parcours({ ...body, etudiant: params.id });
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Parcours ajouté" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    // This assumes we might have multiple parcours items or we update a specific one.
    // Usually, for a sub-resource like this, we might need the parcoursId.
    // However, following the pattern:
    try {
        await dbConnect();
        const body = await req.json();
        const { parcoursId, ...updateData } = body;
        const item = await Parcours.findByIdAndUpdate(parcoursId, updateData, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Parcours non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Parcours mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const parcoursId = searchParams.get("parcoursId");
        if (!parcoursId) return NextResponse.json({ success: false, message: "ID manquant" }, { status: 400 });
        const item = await Parcours.findByIdAndDelete(parcoursId);
        if (!item) return NextResponse.json({ success: false, message: "Parcours non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Parcours supprimé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
