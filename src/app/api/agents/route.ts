import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { Agent } from "@/lib/models";
//Create - Agent
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newAgent = await Agent.create(body);
        return NextResponse.json({ success: true, newAgent });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Read - Agent
export async function GET(request: Request) {
    try {
        await dbConnect();
        const agents = await Agent.find();
        return NextResponse.json({ success: true, agents });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Update - Agent
export async function PUT(request: Request, props: { params: Promise<{ agentId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await request.json();
        const agentId = params.agentId;
        const agents = await Agent.findByIdAndUpdate(agentId.toString(), body, { new: true });
        return NextResponse.json({ success: true, agents });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

//Delete - Agent
export async function DELETE(request: Request, props: { params: Promise<{ agentId: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const agentId = params.agentId;
        const agents = await Agent.findByIdAndDelete(agentId.toString());
        return NextResponse.json({ success: true, agents });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}