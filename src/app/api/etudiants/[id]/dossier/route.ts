import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { DossierEtudiant } from "@/lib/models/index";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await DossierEtudiant.findOne({ etudiant: params.id as any });
        if (!item) return NextResponse.json({ success: false, message: "Dossier non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        const item = new DossierEtudiant({ ...body, etudiant: params.id });
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Dossier créé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        const item = await DossierEtudiant.findOneAndUpdate({ etudiant: params.id as any }, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Dossier non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Dossier mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await DossierEtudiant.findOneAndDelete({ etudiant: params.id as any });
        if (!item) return NextResponse.json({ success: false, message: "Dossier non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Dossier supprimé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
