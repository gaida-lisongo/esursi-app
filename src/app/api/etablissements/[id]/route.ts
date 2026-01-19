import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Etablissement } from "@/lib/models";
import { Faculte, Mention } from "@/lib/models/Etablissement";

//Read - Etablissement
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const id = params.id;
        const etablissement = await Etablissement.findById(id)
            .populate("province")
            .populate("coge.agent")
            .populate("rapports.annee")
            .lean();

        const mentions = await Mention.find({ etablissement: id }).populate("domaine").lean();
        const mentionsWithFacultes = [];
        for (const mention of mentions) {
            const facultes = await Faculte.find({ mention: mention._id }).lean();
            mentionsWithFacultes.push({
                ...mention,
                facultes: facultes || []
            });
        }
        return NextResponse.json({ success: true, data: { ...etablissement, mentions: mentionsWithFacultes } });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Update - Etablissement
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await request.json();
        const id = params.id;
        const etablissement = await Etablissement.findByIdAndUpdate(id, body, { new: true }).populate("province");
        return NextResponse.json({ success: true, etablissement });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Delete - Etablissement
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const id = params.id;
        const etablissement = await Etablissement.findByIdAndDelete(id).populate("province");
        return NextResponse.json({ success: true, etablissement });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}