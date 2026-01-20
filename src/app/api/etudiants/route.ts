import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Etudiant } from "@/lib/models/index";

export async function GET(props: { params: { matricule: string } }) {
    const { matricule } = await props.params;
    try {
        await dbConnect();

        let query = {};

        if (matricule) {
            query = { matricule: matricule };
        }

        const items = await Etudiant.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Matricule Generation: EEC-2026-0001
        const year = new Date().getFullYear();
        const lastEtudiant = await Etudiant.findOne({ matricule: new RegExp(`^EEC-${year}-`) }).sort({ matricule: -1 });

        let nextCount = 1;
        if (lastEtudiant) {
            const lastPart = lastEtudiant.matricule.split("-").pop();
            if (lastPart) nextCount = parseInt(lastPart) + 1;
        }

        const matricule = `EEC-${year}-${nextCount.toString().padStart(4, '0')}`;

        const item = new Etudiant({ ...body, matricule });
        await item.save();

        return NextResponse.json({ success: true, data: item, message: "Étudiant créé avec succès" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
