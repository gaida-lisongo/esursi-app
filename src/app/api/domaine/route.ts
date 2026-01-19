import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Domaine } from "@/lib/models";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const searchTerm = new URL(request.url).searchParams;
        const term = searchTerm.get("term") || "";
        const cycle = searchTerm.get("cycle") || "";

        let domaineSchems;

        if (searchTerm) {
            let query = {}
            if (term) {
                query = {
                    $or: [
                        { code: { $regex: term, $options: "i" } },
                        { designation: { $regex: term, $options: "i" } },
                    ],
                }
            }
            if (cycle) {
                query = {
                    ...query,
                    cycle: cycle,
                }
            }
            domaineSchems = Domaine.find(query).populate("cycle");
        } else {
            domaineSchems = Domaine.find().populate("cycle");
        }
        const domaines = await domaineSchems
        return NextResponse.json({ success: true, domaines });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { designation, code, description, mentions, cycle } = await request.json();
        const domaine = await Domaine.create({ designation, code, description, mentions, cycle });
        return NextResponse.json({ success: true, domaine });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { id, designation, code, description, mentions, cycle } = await request.json();
        const domaine = await Domaine.findByIdAndUpdate(id, { designation, code, description, mentions, cycle }, { new: true });
        return NextResponse.json({ success: true, domaine });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { id } = await request.json();
        const domaine = await Domaine.findByIdAndDelete(id);
        return NextResponse.json({ success: true, domaine });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
