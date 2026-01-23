"use server";

import dbConnect from "@/lib/connect";
import { Etablissement, Faculte, Mention } from "@/lib/models";
import { Programme } from "@/lib/models/Programme";

export async function getProgrammesByEtablissement(etabId: string) {
    try {
        await dbConnect();
        
        // Trouver les mentions liées à cet établissement
        const mentions = await Mention.find({ etablissement: etabId?.toString() })
            .populate("domaine")
            .lean();

        if (!mentions || mentions.length === 0) {
            return {
                success: true,
                data: []
            };
        }

        // Trouver les facultés qui ont ces mentions
        const facultes = await Faculte.find({
            mention: { $in: mentions.map((m) => m._id) }
        })
        .populate({
            path: "programmes",
            model: "Programme",
            populate: {
                path: "cycle",
                model: "Cycle"
            }
        })
        .populate({
            path: "mention",
            model: "Mention",
            populate: {
                path: "domaine",
                model: "Domaine"
            }
        })
        .populate({
            path: "equipe.agent",
            model: "Agent"
        })
        .lean();

        if (!facultes || facultes.length === 0) {
            return {
                success: true,
                data: []
            };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(facultes))
        };
    } catch (error: any) {
        console.error("Erreur getProgrammesByEtablissement:", error);
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des programmes"
        };
    }
}