import { NextResponse } from "next/server";
import dbConnect from "@/lib/connect";
import { DossierEtudiant } from "@/lib/models/index";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const item = await DossierEtudiant.findOne({ etudiant: params.id as any });
        if (!item) return NextResponse.json({ success: false, message: "Dossier non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();
        //If is exist add document
        const dossier = await DossierEtudiant.findOne({ etudiant: params.id as any });

        if (dossier) {
            if (Array.isArray(body?.scolarite)) {
                dossier.scolarite.push(...body.scolarite);
            } else if (body?.scolarite) {
                // In case it's a single object
                dossier.scolarite.push(body.scolarite);
            }
            await dossier.save();
            return NextResponse.json({ success: true, data: dossier, message: "Document ajouté" });
        }
        const item = new DossierEtudiant({ ...body, etudiant: params.id });
        await item.save();
        return NextResponse.json({ success: true, data: item, message: "Dossier créé" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const body = await req.json();

        // Check if we are updating a specific sub-document (scolarite item)
        // expecting body to have { _id: "subdoc_id", ...fieldsToUpdate } or similar
        const documentId = body._id || body.documentId;

        if (documentId) {
            const updateFields: any = {};
            if (body.annee) updateFields["scolarite.$.annee"] = body.annee;
            if (body.document) updateFields["scolarite.$.document"] = body.document;
            if (body.date) updateFields["scolarite.$.date"] = body.date;
            if (body.status) updateFields["scolarite.$.status"] = body.status;

            const item = await DossierEtudiant.findOneAndUpdate(
                { etudiant: params.id as any, "scolarite._id": documentId },
                { $set: updateFields },
                { new: true }
            );
            if (!item) return NextResponse.json({ success: false, message: "Document non trouvé dans le dossier" }, { status: 404 });
            return NextResponse.json({ success: true, data: item, message: "Document mis à jour" });
        }

        // Default behavior: update the main dossier fields (if any)
        // or if body contains the whole structure. 
        // Be careful: this matches the original implementation fallback.
        const item = await DossierEtudiant.findOneAndUpdate({ etudiant: params.id as any }, body, { new: true });
        if (!item) return NextResponse.json({ success: false, message: "Dossier non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Dossier mis à jour" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const documentId = searchParams.get("documentId");

        if (!documentId) {
            return NextResponse.json({ success: false, message: "ID du document requis. La suppression complète du dossier est interdite." }, { status: 400 });
        }

        const item = await DossierEtudiant.findOneAndUpdate(
            { etudiant: params.id as any },
            { $pull: { scolarite: { _id: documentId } } },
            { new: true }
        );

        if (!item) return NextResponse.json({ success: false, message: "Dossier ou document non trouvé" }, { status: 404 });
        return NextResponse.json({ success: true, data: item, message: "Document supprimé de la scolarité" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
