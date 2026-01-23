"use server";

import dbConnect from "@/lib/connect";
import { Paiement } from "@/lib/models/Recette";

export async function getPaiementsByMinerval(minervalId: string) {
    try {
        await dbConnect();
        const paiements = await Paiement.find({
            tranche: minervalId
        })
        .populate("etudiant")
        .populate("tranche")
        .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(paiements))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des paiements"
        };
    }
}

export async function getPaiementsByInscription(inscriptionId: string) {
    try {
        await dbConnect();
        const paiements = await Paiement.find({
            tranche: inscriptionId
        })
        .populate("etudiant")
        .populate("tranche")
        .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(paiements))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des paiements"
        };
    }
}