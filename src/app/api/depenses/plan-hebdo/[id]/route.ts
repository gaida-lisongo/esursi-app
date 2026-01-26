import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { PlanHebdo, Ordre } from "@/lib/models/index";
import mongoose from "mongoose";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await PlanHebdo.findById(params.id)
            .populate("lignes")
            .populate("ordres")
            .populate("ordres.ligne")
            .populate("budget");
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
        const item = await PlanHebdo.findByIdAndUpdate(params.id, body, { new: true });
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
        
        // D'abord récupérer le plan pour obtenir les ordres associés
        const plan = await PlanHebdo.findById(params.id);
        if (!plan) {
            return NextResponse.json({ success: false, message: "Plan non trouvé" }, { status: 404 });
        }

        // Supprimer tous les ordres associés au plan
        if (plan.ordres && plan.ordres.length > 0) {
            const ordreIds = plan.ordres.map(id => new mongoose.Types.ObjectId(id.toString()));
            await Ordre.deleteMany({ _id: { $in: ordreIds } });
        }

        // Ensuite supprimer le plan lui-même
        const deletedPlan = await PlanHebdo.findByIdAndDelete(params.id);
        
        return NextResponse.json({ 
            success: true, 
            message: `Plan supprimé avec ${plan.ordres?.length || 0} ordre(s) associé(s)` 
        });
    } catch (error: any) {
        console.error("Erreur lors de la suppression:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
