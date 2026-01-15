"use server";

import dbConnect from "@/lib/connect";
import { Cycle, Programme } from "@/lib/models/Programme";
import { revalidatePath } from "next/cache";

// --- CYCLE ACTIONS ---

export async function getCycles() {
    try {
        await dbConnect();
        const cycles = await Cycle.find({}).lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(cycles)).map((c: any) => ({
                ...c,
                id: c._id.toString(),
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createCycle(data: any) {
    try {
        await dbConnect();
        const cycle = new Cycle(data);
        await cycle.save();
        revalidatePath("/(admin)/programmes");
        return { success: true, message: "Cycle créé avec succès" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateCycle(cycleId: string, data: any) {
    try {
        await dbConnect();
        await Cycle.findByIdAndUpdate(cycleId, data);
        revalidatePath("/(admin)/programmes");
        return { success: true, message: "Cycle mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteCycle(cycleId: string) {
    try {
        await dbConnect();
        // Check if cycle has programmes
        const count = await Programme.countDocuments({ cycle: cycleId });
        if (count > 0) return { success: false, message: "Impossible de supprimer : ce cycle contient des programmes" };

        await Cycle.findByIdAndDelete(cycleId);
        revalidatePath("/(admin)/programmes");
        return { success: true, message: "Cycle supprimé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- PROGRAMME ACTIONS ---

export async function getProgrammesByCycle(cycleId: string) {
    try {
        await dbConnect();
        const programmes = await Programme.find({ cycle: cycleId }).populate("cycle").lean();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(programmes)).map((p: any) => ({
                ...p,
                id: p._id.toString(),
            })),
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createProgramme(data: any) {
    try {
        await dbConnect();
        const programme = new Programme(data);
        await programme.save();
        revalidatePath(`/(admin)/programmes/${data.cycle}`);
        return { success: true, message: "Programme créé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateProgramme(programmeId: string, data: any) {
    try {
        await dbConnect();
        const prog = await Programme.findByIdAndUpdate(programmeId, data);
        revalidatePath(`/(admin)/programmes/${data.cycle || prog?.cycle}`);
        return { success: true, message: "Programme mis à jour" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteProgramme(programmeId: string) {
    try {
        await dbConnect();
        const prog = await Programme.findById(programmeId);
        if (!prog) return { success: false, message: "Programme non trouvé" };

        const cycleId = prog.cycle.toString();
        await Programme.findByIdAndDelete(programmeId);
        revalidatePath(`/(admin)/programmes/${cycleId}`);
        return { success: true, message: "Programme supprimé" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
