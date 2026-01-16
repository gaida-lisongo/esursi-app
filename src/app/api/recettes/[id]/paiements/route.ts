import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Paiement } from "@/lib/models/index";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const items = await Paiement.find({ tranche: params.id as any }).populate("etudiant");
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const searchParams = new URL(req.url).searchParams; // Get the search parameters from the URL
        const paiementId = searchParams.get("paiementId"); // Get the 'paiementId' parameter
        const body = await req.json();
        const item = await Paiement.findByIdAndUpdate(paiementId, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Paiement non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Paiement mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const searchParams = new URL(req.url).searchParams;
        const paiementId = searchParams.get("paiementId");
        const item = await Paiement.findByIdAndDelete(paiementId);
        if (!item) return NextResponse.json({ success: false, message: "Paiement non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Paiement supprimé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

