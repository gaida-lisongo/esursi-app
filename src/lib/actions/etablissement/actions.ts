"use server";

import dbConnect from "@/lib/connect";
import { Etablissement, Faculte, Annee, Province, Agent } from "@/lib/models/index";
import { revalidatePath } from "next/cache";
import MegaService from "@/lib/utils/Mega";
import fs from "fs";
import path from "path";
import os from "os";

// --- ETABLISSEMENT ACTIONS ---

export async function getEtablissements() {
    try {
        await dbConnect();
        const items = await Etablissement.find({}).populate("province").lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)).map((a: any) => ({
                ...a,
                id: a._id.toString(),
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createEtablissement(data: any) {
    try {
        await dbConnect();
        const item = new Etablissement({ ...data, actif: true });
        await item.save();
        revalidatePath("/(admin)/etablissements");
        return { success: true, message: "Établissement créé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateEtablissement(id: string, data: any) {
    try {
        await dbConnect();
        await Etablissement.findByIdAndUpdate(id, data);
        revalidatePath("/(admin)/etablissements");
        return { success: true, message: "Établissement mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteEtablissement(id: string) {
    try {
        await dbConnect();
        await Etablissement.findByIdAndDelete(id);
        revalidatePath("/(admin)/etablissements");
        return { success: true, message: "Établissement supprimé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addReport(etabId: string, formData: FormData) {
    try {
        await dbConnect();
        const titre = formData.get("titre") as string;
        const date = formData.get("date") as string;
        const annee = formData.get("annee") as string;
        const file = formData.get("file") as File;

        if (!file || !titre || !date || !annee) {
            throw new Error("Toutes les informations sont requises");
        }

        // Sauvegarder temporellement le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const tempPath = path.join(os.tmpdir(), file.name);
        fs.writeFileSync(tempPath, buffer);

        // Upload vers Mega
        const megaFile = await MegaService.upload(tempPath);
        const link = await MegaService.getLink(megaFile);

        // Supprimer le fichier temp
        fs.unlinkSync(tempPath);

        const newReport = {
            titre,
            date,
            annee,
            document: link
        };

        await Etablissement.findByIdAndUpdate(etabId, {
            $push: { rapports: newReport }
        });

        revalidatePath("/(admin)/(coge)/dg/[slug]", "page");
        return { success: true, message: "Rapport ajouté avec succès" };

    } catch (error: any) {
        console.error("Error adding report:", error);
        return { success: false, message: error.message };
    }
}

export async function deleteReport(etabId: string, reportId: string) {
    try {
        await dbConnect();
        await Etablissement.findByIdAndUpdate(etabId, {
            $pull: { rapports: { _id: reportId } }
        });
        revalidatePath("/(admin)/(coge)/dg/[slug]", "page");
        return { success: true, message: "Rapport supprimé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- COGE & DETAILS ---

export async function updateCOGE(id: string, coge: any[]) {
    try {
        await dbConnect();
        await Etablissement.findByIdAndUpdate(id, { coge });
        revalidatePath("/(admin)/etablissements");
        return { success: true, message: "Comité de gestion mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getEtablissementFull(id: string) {
    try {
        await dbConnect();
        const item = await Etablissement.findById(id)
            .populate("coge.agent")
            .populate("rapports.annee")
            .lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(item))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- FACULTE ACTIONS ---

export async function getFacultesByEtablissement(etablissementId: string) {
    try {
        await dbConnect();
        const items = await Faculte.find({ etablissement: etablissementId as any })
            .populate("programmes")
            .lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)).map((a: any) => ({
                ...a,
                id: a._id.toString(),
                programmesCount: a.programmes?.length || 0
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteFaculte(id: string, etablissementId: string) {
    try {
        await dbConnect();
        await Faculte.findByIdAndDelete(id);
        revalidatePath(`/(admin)/etablissements/${etablissementId}`);
        return { success: true, message: "Faculté supprimée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
