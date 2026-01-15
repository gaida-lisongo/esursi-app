"use server";

import dbConnect from "@/lib/connect";
import { Etablissement, Faculte, Annee, Province, Agent } from "@/lib/models/index";
import { revalidatePath } from "next/cache";

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
