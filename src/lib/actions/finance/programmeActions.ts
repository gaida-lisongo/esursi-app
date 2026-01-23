"use server";

import dbConnect from "@/lib/connect";
import { Etablissement, Faculte, Mention } from "@/lib/models";
import { Programme } from "@/lib/models/Programme";

export async function getProgrammesByEtablissement(etabId: string) {
    try {
        await dbConnect();
        
        // Trouver les mentions liées à cet établissement
        const mentions = await Mention.find({ etablissement: etabId?.toString() })
            .populate({
                path: "domaine",
                model: "Domaine",
                populate: {
                    path: "cycle",
                    model: "Cycle"
                }
            })
            .lean();

        if (!mentions || mentions.length === 0) {
            return {
                success: true,
                data: []
            };
        }

        // Trouver les programmes qui sont dans les cycles des mentions trouvées
        const cycleIds = mentions.map(mention => mention.domaine.cycle._id);
        const programmes = await Programme.find({ cycle: { $in: cycleIds } })
            .populate({
                path: "cycle",
                model: "Cycle"
            })
            .lean();

        // Enrichir les programmes avec les informations des mentions et domaines
        const enrichedProgrammes = programmes.map(programme => {
            const relatedMention = mentions.find(mention => 
                mention.domaine.cycle._id.toString() === programme.cycle._id.toString()
            );
            
            return {
                ...programme,
                mention: relatedMention ? {
                    _id: relatedMention._id,
                    designation: relatedMention.designation,
                    domaine: relatedMention.domaine
                } : null
            };
        });
  
        return {
            success: true,
            data: JSON.parse(JSON.stringify(enrichedProgrammes))
        };
    } catch (error: any) {
        console.error("Erreur getProgrammesByEtablissement:", error);
        return {
            success: false,
            message: error.message || "Erreur lors de la récupération des programmes"
        };
    }
}