import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { PlanHebdo } from "@/lib/models/index";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        const { pieces } = body;

        if (!Array.isArray(pieces)) {
            return NextResponse.json(
                { success: false, message: "Les pièces doivent être un tableau" },
                { status: 400 }
            );
        }

        const item = await PlanHebdo.findByIdAndUpdate(
            params.id,
            { pieces },
            { new: true }
        );

        if (!item) {
            return NextResponse.json(
                { success: false, message: "Plan hebdomadaire non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: item,
            message: "Pièces justificatives mises à jour"
        });
    } catch (error: any) {
        console.error("Erreur lors de la mise à jour des pièces:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}