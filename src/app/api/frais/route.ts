import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Frais } from "@/lib/models";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const searchTerm = new URL(request.url).searchParams;
        const annee = searchTerm.get("annee") || "";

        let query = {}
        if (annee) {
            query = {
                ...query,
                annee: annee,
            }
        }
        const frais = await Frais.find(query)
            .populate("annee")
            .populate("repartition")
            .where("actif").equals(true);
        return NextResponse.json({ success: true, frais });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}