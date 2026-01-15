"use server";

import dbConnect from "@/lib/connect";
import { Annee, Activite } from "@/lib/models/Annee";
import { revalidatePath } from "next/cache";

// --- ANNEE ACTIONS ---

export async function getAnnees() {
    try {
        await dbConnect();
        const annees = await Annee.find({}).sort({ debut: -1 }).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(annees)).map((a: any) => ({
                ...a,
                id: a._id.toString(),
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createAnnee(data: any) {
    try {
        await dbConnect();
        const annee = new Annee({ ...data, calendrier: [] });
        await annee.save();
        revalidatePath("/(admin)/annees");
        return { success: true, message: "Année académique créée", data: JSON.parse(JSON.stringify(annee)) };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateAnnee(id: string, data: any) {
    try {
        await dbConnect();
        await Annee.findByIdAndUpdate(id, data);
        revalidatePath("/(admin)/annees");
        return { success: true, message: "Année mise à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteAnnee(id: string) {
    try {
        await dbConnect();
        await Annee.findByIdAndDelete(id);
        revalidatePath("/(admin)/annees");
        return { success: true, message: "Année supprimée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- CALENDAR / ACTIVITE ACTIONS ---

export async function getAnneeDetails(id: string) {
    try {
        await dbConnect();
        const annee = await Annee.findById(id)
            .populate({
                path: 'calendrier.activites',
                model: Activite
            })
            .lean();

        if (!annee) throw new Error("Année non trouvée");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(annee)) as any
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addCalendarSection(anneeId: string, titre: string) {
    try {
        await dbConnect();
        const annee = await Annee.findById(anneeId);
        if (!annee) throw new Error("Année non trouvée");

        annee.calendrier.push({ titre, activites: [] });
        await annee.save();

        revalidatePath(`/(admin)/annees/${anneeId}`);
        return { success: true, message: "Section ajoutée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function removeCalendarSection(anneeId: string, sectionIndex: number) {
    try {
        await dbConnect();
        const annee = await Annee.findById(anneeId);
        if (!annee) throw new Error("Année non trouvée");

        annee.calendrier.splice(sectionIndex, 1);
        await annee.save();

        revalidatePath(`/(admin)/annees/${anneeId}`);
        return { success: true, message: "Section supprimée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function addActivityToSection(anneeId: string, sectionIndex: number, activityData: any) {
    try {
        await dbConnect();
        const activity = new Activite(activityData);
        await activity.save();

        const annee = await Annee.findById(anneeId);
        if (!annee) throw new Error("Année non trouvée");

        annee.calendrier[sectionIndex].activites.push(activity._id as any);
        await annee.save();

        revalidatePath(`/(admin)/annees/${anneeId}`);
        return { success: true, message: "Activité ajoutée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function removeActivityFromSection(anneeId: string, sectionIndex: number, activityId: string) {
    try {
        await dbConnect();
        const annee = await Annee.findById(anneeId);
        if (!annee) throw new Error("Année non trouvée");

        annee.calendrier[sectionIndex].activites = annee.calendrier[sectionIndex].activites.filter(
            (id: any) => id.toString() !== activityId
        );
        await annee.save();

        // Optionally delete the activity object itself
        await Activite.findByIdAndDelete(activityId);

        revalidatePath(`/(admin)/annees/${anneeId}`);
        return { success: true, message: "Activité retirée" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
