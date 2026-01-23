"use server";

import dbConnect from "@/lib/connect";
import { Minerval } from "@/lib/models/Recette";

export async function getMinervalsByEtabAnnee(etabId: string, anneeId: string) {
    try {
        await dbConnect();
        const minervals = await Minerval.find({
            etablissement: etabId,
            annee: anneeId,
            actif: true
        })
        .populate("tranche")
        .populate("etablissement")
        .populate("annee")
        .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(minervals))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des minervals"
        };
    }
}

export async function createMinerval(data: {
    etablissement: string;
    annee: string;
    tranche: string;
    description?: string[];
}) {
    try {
        await dbConnect();
        const minerval = new Minerval(data);
        await minerval.save();
        
        const populatedMinerval = await Minerval.findById(minerval._id)
            .populate("tranche")
            .populate("etablissement")
            .populate("annee")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(populatedMinerval)),
            message: "Minerval créé avec succès"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la création du minerval"
        };
    }
}

export async function deleteMinerval(minervalId: string) {
    try {
        await dbConnect();
        await Minerval.findByIdAndUpdate(minervalId, { actif: false });
        
        return {
            success: true,
            message: "Minerval supprimé avec succès"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la suppression du minerval"
        };
    }
}

export async function getMinervalDetails(minervalId: string) {
    try {
        await dbConnect();
        const minerval = await Minerval.findById(minervalId)
            .populate("tranche")
            .populate("etablissement")
            .populate("annee")
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(minerval))
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des détails"
        };
    }
}