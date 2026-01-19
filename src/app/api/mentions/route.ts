import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Mention } from "@/lib/models/Etablissement";

//CREATE - MENTION
//Find id of etablisemment from props by Promise
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const mention = await Mention.create(body);
        return NextResponse.json({ success: true, mention });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//READ - MENTION
export async function GET(request: Request) {
    try {
        await dbConnect();
        const searchTerm = new URL(request.url).searchParams;
        const domaineId = searchTerm.get("domaineId") || "";
        const etablissementId = searchTerm.get("etablissementId") || "";
        let query = {};
        if (domaineId) {
            query = { domaine: domaineId };
        }
        if (etablissementId) {
            query = { etablissement: etablissementId };
        }
        const mentions = await Mention.find(query).populate("domaine").populate("etablissement");
        return NextResponse.json({ success: true, mentions });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
//UPDATE - MENTION
export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const mention = await Mention.findByIdAndUpdate(body._id, body, { new: true });
        return NextResponse.json({ success: true, mention });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//DELETE - MENTION
export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const mention = await Mention.findByIdAndDelete(body._id);
        return NextResponse.json({ success: true, mention });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}