import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Agent, Etablissement, Etudiant, Grade } from "@/lib/models";

export async function GET() {
    try {
        await dbConnect();

        /**
         * response { totalEtab: X, totalAgent: X, totalEtudiant: X, totalParcours: X}
         */
        const totalEtab = await Etablissement.find().where({ actif: true }).countDocuments();
        const totalAgent = await Agent.find().where({ action: true }).countDocuments();
        const totalEtudiant = await Etudiant.find().where({ action: true }).countDocuments();

        return NextResponse.json({ success: true, data: { totalEtab, totalAgent, totalEtudiant } });

    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function PATCH() {
    try {
        await dbConnect();
        /**
         * Group Agents By Grade
         */

        const grades = await Grade.find();

        const agents = [];

        for (const grade of grades) {
            const count = await Agent.find({ grade: grade._id }).where({ action: true }).countDocuments();
            agents.push({ grade: grade.designation, count });
        }

        return NextResponse.json({ success: true, data: agents });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}