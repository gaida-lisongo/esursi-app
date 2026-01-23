"use server";

import dbConnect from "@/lib/connect";
import { Inscription } from "@/lib/models/Recette";

export async function getInscriptionsByEtabAnnee(etabId: string, anneeId: string) {
    try {
        await dbConnect();
        const inscriptions = await Inscription.find({
            etablissement: etabId,
            annee: anneeId,
            actif: true
        })
        .populate("tranche")
        .populate("programme")
        .populate("etablissement")
        .populate("annee")
        .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(inscriptions))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des inscriptions"
        };
    }
}

export async function createInscription(data: {
    etablissement: string;
    annee: string;
    tranche: string;
    programme: string;
    description?: string[];
}) {
    try {
        await dbConnect();
        const inscription = new Inscription(data);
        await inscription.save();
        
        const populatedInscription = await Inscription.findById(inscription._id)
            .populate("tranche")
            .populate("programme")
            .populate("etablissement")
            .populate("annee")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(populatedInscription)),
            message: "Inscription créée avec succès"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la création de l'inscription"
        };
    }
}

export async function deleteInscription(inscriptionId: string) {
    try {
        await dbConnect();
        await Inscription.findByIdAndUpdate(inscriptionId, { actif: false });
        
        return {
            success: true,
            message: "Inscription supprimée avec succès"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la suppression de l'inscription"
        };
    }
}

export async function getInscriptionDetails(inscriptionId: string) {
    try {
        await dbConnect();
        const inscription = await Inscription.findById(inscriptionId)
            .populate("tranche")
            .populate("programme")
            .populate("etablissement")
            .populate("annee")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(inscription))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des détails"
        };
    }
}