import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import Article from "@/lib/models/Article";

export async function GET() {
    try {
        await dbConnect();
        const articles = await Article.find();
        return NextResponse.json({ success: true, articles });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const article = new Article(body);
        await article.save();
        return NextResponse.json({ success: true, article });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const article = await Article.findByIdAndUpdate(body.id, body, { new: true });
        return NextResponse.json({ success: true, article });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const article = await Article.findByIdAndDelete(body.id);
        return NextResponse.json({ success: true, article });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
