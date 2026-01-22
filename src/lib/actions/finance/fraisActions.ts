"use server";

import dbConnect from "@/lib/connect";
import { Budget, Paiement, Parcours, PlanHebdo, Tranche } from "@/lib/models";
import { Frais, Quota } from "@/lib/models/Frais";
import { revalidatePath } from "next/cache";

// --- FRAIS ACTIONS ---

export async function getFraisByAnnee(anneeId: string) {
    try {
        await dbConnect();
        const items = await Frais.find({ annee: anneeId as any }).populate("repartition").lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)).map((f: any) => ({
                ...f,
                id: f._id.toString(),
                repartitionCount: f.repartition?.length || 0
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createFrais(data: any) {
    try {
        await dbConnect();
        const item = new Frais({ ...data, actif: true });
        await item.save();
        revalidatePath("/(admin)/frais");
        return { success: true, message: "Frais créés" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateFrais(id: string, data: any) {
    try {
        await dbConnect();
        await Frais.findByIdAndUpdate(id, data);
        revalidatePath("/(admin)/frais");
        return { success: true, message: "Frais mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteFrais(id: string) {
    try {
        await dbConnect();
        // Delete associated quotas? User didn't specify, but often good. 
        // For now just the fee.
        await Frais.findByIdAndDelete(id);
        revalidatePath("/(admin)/frais");
        return { success: true, message: "Frais supprimés" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- QUOTA ACTIONS ---

export async function getQuotasByFrais(fraisId: string) {
    try {
        await dbConnect();
        const frais = await Frais.findById(fraisId).populate("repartition").lean();
        if (!frais) throw new Error("Frais non trouvés");
        return {
            success: true,
            data: JSON.parse(JSON.stringify(frais.repartition || [])).map((q: any) => ({
                ...q,
                id: q._id.toString()
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addQuota(fraisId: string, quotaData: any) {
    try {
        await dbConnect();
        const quota = new Quota(quotaData);
        await quota.save();

        await Frais.findByIdAndUpdate(fraisId, {
            $push: { repartition: quota._id }
        });

        revalidatePath("/(admin)/frais");
        return { success: true, message: "Quota ajouté" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateQuota(id: string, data: any) {
    try {
        await dbConnect();
        await Quota.findByIdAndUpdate(id, data);
        revalidatePath("/(admin)/frais");
        return { success: true, message: "Quota mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function removeQuota(fraisId: string, quotaId: string) {
    try {
        await dbConnect();
        await Quota.findByIdAndDelete(quotaId);
        await Frais.findByIdAndUpdate(fraisId, {
            $pull: { repartition: quotaId }
        });
        revalidatePath("/(admin)/frais");
        return { success: true, message: "Quota retiré" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- PAIEMENTS FRAIS ---
export async function getTransactionsByFrais(fraisId: string): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
}> {
    try {
        await dbConnect();

        // Trouver d'abord les tranches associées au frais
        const trancheIds: any[] = await Tranche.find({ frais: fraisId } as any).distinct("_id");

        // Filtrer les paiements qui appartiennent à ces tranches
        const transactions = await Paiement.find({ tranche: { $in: trancheIds } })
            .populate("etudiant")
            .populate({
                path: "tranche",
                populate: {
                    path: "frais"
                }
            })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(transactions)).map((t: any) => ({
                ...t,
                id: t._id.toString()
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- FETCH DETAILS PARCOURS ---
export async function getParcoursByAnneeEtab(anneeId: string, etablissementId: string): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
}> {
    try {

        await dbConnect();
        const items = await Parcours.find({ annee: anneeId, etablissement: etablissementId } as any)
            .populate("etudiant")
            .populate("annee")
            .populate("programme")
            .populate("tranche")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)).map((p: any) => ({
                ...p,
                id: p._id.toString()
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
// --- FETCH DETAILS BUDGET ---
export async function getBudgetsByAnneeEtab(anneeId: string, etablissementId: string): Promise<{
    success: boolean;
    message?: string;
    data?: any;
}> {
    try {

        await dbConnect();

        const budget = await Budget.findOne({ annee: anneeId, etablissement: etablissementId } as any)
            .populate("etablissement")
            .populate("details.ligne")
            .populate("annee")
            .lean();

        if (!budget) return { success: false, message: "Budget non trouvé" };

        const items = await PlanHebdo.find({ budget: budget._id } as any)
            .populate("lignes")
            .populate("ordres")
            .populate("ordres.ligne")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify({
                ...budget,
                planHebdo: items
            }))
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}