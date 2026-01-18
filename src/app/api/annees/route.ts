import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Annee } from "@/lib/models";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const annees = await Annee.find()
            .populate("calendrier.activites")
            .where("actif").equals(true);
        return NextResponse.json({ success: true, annees });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
