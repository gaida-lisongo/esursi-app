import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Etablissement, Programme } from "@/lib/models";
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
            .populate("rapports.annee");

        const mentions = await Mention.find({ etablissement: id })
            .populate("domaine")
            .populate("domaine.cycle");
        const mentionsWithFacultes = [];
        for (const mention of mentions) {
            const facultes = await Faculte.find({ mention: mention._id }).populate("mention").populate("equipe.agent");
            const programmes = await Programme.find({ cycle: mention?.domaine?.cycle?._id });
            mentionsWithFacultes.push({
                ...mention,
                facultes: facultes || [],
                programmes: programmes || []
            });
        }
        return NextResponse.json({ success: true, data: { ...etablissement, mentions: mentionsWithFacultes } });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Update - Etablissement
//Update - Etablissement
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();

        // Verify Authentication
        const { verifyEtablissementToken, unauthorizedResponse } = await import("@/lib/utils/verifyToken");
        const decoded = verifyEtablissementToken(request, params.id);

        if (!decoded) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const id = params.id;
        const etablissement = await Etablissement.findByIdAndUpdate(id, body, { new: true }).populate("province");
        return NextResponse.json({ success: true, data: etablissement });
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