import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Etablissement, Province } from "@/lib/models";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const searchTerm = new URL(request.url).searchParams;
        const term = searchTerm.get("term") || "";
        const province = searchTerm.get("province") || "";
        const nref = searchTerm.get("nref") || "";

        let etablissementSchems;

        if (searchTerm) {
            let query = {}
            if (term) {
                query = {
                    $or: [
                        { sigle: { $regex: term, $options: "i" } },
                        { designation: { $regex: term, $options: "i" } },
                    ],
                }
            }
            if (province) {
                query = {
                    ...query,
                    province: province,
                }
            }
            if (nref) {
                query = {
                    ...query,
                    nref: nref,
                }
            }
            etablissementSchems = Etablissement.find(query).where("actif").equals(true);
        } else {
            etablissementSchems = Etablissement.find().where("actif").equals(true);
        }
        const etablissements = await etablissementSchems
        return NextResponse.json({ success: true, etablissements });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const provinces = await Province.find().where("actif").equals(true);
        return NextResponse.json({ success: true, provinces });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}