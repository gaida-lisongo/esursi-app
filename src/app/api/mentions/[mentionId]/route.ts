import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Faculte } from "@/lib/models/Etablissement";

//Create - Faculte
export async function POST(request: Request, props: { params: Promise<{ mentionId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await request.json();
        const mentionId = params.mentionId;

        const newFaculte = await Faculte.create({
            ...body,
            mention: mentionId
        });
        return NextResponse.json({ success: true, newFaculte });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Read - Faculte
export async function GET(request: Request, props: { params: Promise<{ mentionId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const mentionId = params.mentionId;
        const facultes = await Faculte.find({ mention: mentionId.toString() }).populate("mention");
        return NextResponse.json({ success: true, facultes });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Update - Faculte
export async function PUT(request: Request, props: { params: Promise<{ mentionId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await request.json();
        const { faculteId, payload } = body;
        const facultes = await Faculte.findByIdAndUpdate(faculteId.toString(), payload, { new: true });
        return NextResponse.json({ success: true, facultes });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Delete - Faculte
export async function DELETE(request: Request, props: { params: Promise<{ mentionId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const mentionId = params.mentionId;
        const facultes = await Faculte.findByIdAndDelete(mentionId.toString()).populate("mention");
        return NextResponse.json({ success: true, facultes });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}